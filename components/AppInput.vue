<template>
  <div
    ref="$el"
    class="app-input"
    :class="{ disabled, readonly, required, typed, focused, error: error || errorRequired }"
    @click="focus"
  >
    <div class="input">
      <Icon v-if="icon" :name="icon" class="app-input__icon" />

      <div class="field">
        <div v-if="label" class="label">{{ label }}</div>

        <slot name="field">
          <input
            ref="$input"
            :type="type"
            :value="modelValue"
            :min="min"
            :max="max"
            :step="step"
            :disabled="disabled"
            :readonly="readonly"
            :autocomplete="autocomplete"
            :maxlength="maxlength"
            :placeholder="typed ? placeholder : label || placeholder"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @keyup.enter="onEnter"
            @keyup.esc="onEsc"
            @drop="$emit('drop', $event)"
            @paste="$emit('paste', $event)"
          />
        </slot>
      </div>

      <slot name="field-after" />
    </div>

    <div v-if="err_message" class="error">{{ err_message }}</div>
    <div v-else-if="notes" class="notes">{{ notes }}</div>

    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue'

defineOptions({ name: 'AppInput' })

export interface Input {
  debounce?: number

  type?: string
  icon?: string

  min?: number | string // @todo сделать app-input-number
  max?: number | string // @todo сделать app-input-number
  step?: number | string // @todo сделать app-input-number

  required?: boolean
  autocomplete?: string

  label?: string
  placeholder?: string

  maxlength?: number | string

  notes?: string

  error?: string
  errorRequired?: string
}

export type InputModelValue = string | number | boolean | Date | unknown[] | object

export interface InputProps extends Input {
  modelValue?: InputModelValue

  disabled?: boolean // @todo вынести в @composables
  readonly?: boolean // @todo вынести в @composables

  fieldFocusMethod?: string
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  fieldFocusMethod: '',
  debounce: 0,

  type: 'text',
  disabled: false,
  readonly: false,
})

const $emit = defineEmits([
  'update:model-value',
  'change:model-value',
  'focus',
  'blur',
  'enter',
  'esc',
  'drop',
  'paste',
])

const setModelValue = (value: InputModelValue) => {
  clearDebounce()
  $emit('update:model-value', value)

  if ($field.value instanceof HTMLInputElement) {
    $field.value.value = value == null ? '' : (value as string)
  }
}

const focused = ref(false)

const focus = () => {
  if (enabled.value) {
    if ($field.value instanceof HTMLInputElement) {
      focused.value = true

      nextTick(() => {
        switch (props.fieldFocusMethod) {
          case 'click':
            {
              $field.value?.click()
            }
            break

          default: {
            $field.value?.focus()
          }
        }
      })
    }
  }
}

const select = () => {
  if (enabled.value) {
    if ($field.value instanceof HTMLInputElement) {
      $field.value.select()
    }
  }

  return this
}

const onFocus = () => {
  if (enabled.value) {
    focused.value = true
    $emit('focus')
  }
}

const onBlur = ($event: Event) => {
  focused.value = false

  if ($event !== undefined) {
    onInput($event, true)
  }

  $emit('blur')
}

const onInput = ($event: Event, debounce_force: boolean = false) => {
  $emitValue(($event.target as HTMLInputElement).value, debounce_force)
}

const onEnter = ($event: Event) => {
  onInput($event, true)
  $emit('enter', ($event.target as HTMLInputElement).value)
}

const onEsc = ($event: Event) => {
  $emit('esc', ($event.target as HTMLInputElement).value)
}

let debounce_timeout: number | NodeJS.Timeout | null = null

const $emitValue = (value: unknown, debounce_force: boolean) => {
  clearDebounce()
  const debounce = debounce_force ? 0 : props.debounce

  if (debounce) {
    debounce_timeout = setTimeout(() => $emitInput(value), debounce)
  } else {
    $emitInput(value)
  }
}

const $emitInput = (val: unknown) => {
  const value =
    props.type === 'number' // @todo сделать app-input-number
      ? Number(val)
      : val

  $emit('update:model-value', value)

  if (props.modelValue != value) {
    $emit('change:model-value', value)
  }
}

const clearDebounce = () => {
  if (debounce_timeout !== null) {
    clearTimeout(debounce_timeout)

    debounce_timeout = null
  }
}

const typed = computed(
  () =>
    focused.value ||
    (Array.isArray(props.modelValue)
      ? (props.modelValue as unknown[]).length > 0
      : props.modelValue === 0 || Boolean(props.modelValue)),
)

const enabled = computed(() => !(props.disabled || props.readonly))

const err_message = computed(() => (props.errorRequired ? '* ' + props.errorRequired : props.error))

const $el = ref<HTMLDivElement | null>(null)
const $input = ref<HTMLInputElement | null>(null)
const $field = computed<HTMLInputElement | null>(() =>
  $input.value instanceof HTMLInputElement
    ? $input.value
    : $el.value instanceof HTMLDivElement
      ? $el.value.querySelector('input')
      : null,
)

defineExpose({
  $el,
  setModelValue,

  select,

  onBlur,
  onFocus,
  focus,
})
</script>

<style lang="scss">
.app-input {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  color: $color-input-text;
  font-size: $input-font-size;
  line-height: $input-line-height;
  font-weight: $input-font-weight;
  text-align: left;
  position: relative;

  &__icon {
    font-size: 24px;
    color: $color-input-border;
  }

  .input {
    width: 100%;
    min-height: $input-padding-y * 2 + $input-icon-size;
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    gap: $input-gap-x;

    font-size: $input-font-size;
    line-height: $input-line-height;
    font-weight: $input-font-weight;

    padding: #{$input-padding-y - $input-border-width} #{$input-padding-x - $input-border-width};

    border: $input-border-width solid $color-input-border;
    border-radius: $input-border-radius;
    background: $color-input-background;
    transition: $input-transition-delay;

    & > * {
      transition: $input-transition-delay;
    }

    & > i {
      flex-shrink: 0;
      color: $color-input-icon;
      font-size: $input-icon-size;
    }

    .field {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: $input-gap-y;
      min-height: $input-label-line-height + $input-gap-y + $input-line-height;
    }

    .label {
      max-width: 100%;
      height: inherit;
      color: inherit;
      font-size: inherit;
      line-height: inherit;
      user-select: none;

      @include text-overflow();
    }

    input {
      width: 100%;
      flex-grow: 1;
      min-width: 0;
      height: $input-line-height;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      font-weight: inherit;
      text-align: inherit;
      padding: 0;
      border: none;
      outline: none;
      box-shadow: none;

      &::placeholder {
        color: $color-input-label;
      }
    }
  }

  .notes,
  .error {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    font-size: $input-notes-error-font-size;
    line-height: $input-notes-error-line-height;
    font-weight: $input-notes-error-font-weight;
    padding: $input-notes-error-offset $input-padding-x 0;

    @include text-overflow();
  }

  .notes {
    color: $color-input-notes;
  }
  .error {
    color: $color-input-error;
  }

  &:not(.typed):not(.focused) {
    .input {
      input {
        display: none;
      }
    }
  }

  &.focused {
    .input {
      border-color: $color-input-border--focused;
    }
  }

  &.typed {
    .label {
      height: $input-label-line-height;
      color: $color-input-label;
      font-size: $input-label-font-size;
      line-height: $input-label-line-height;
      font-weight: $input-label-font-weight;
    }
  }

  &.error {
    .input {
      border-color: $color-input-error;
    }

    .label {
      color: $color-input-error;
    }
  }

  &.disabled {
    opacity: $input-opacity--disabled;

    [disabled] {
      cursor: default;
      background: transparent;
    }
  }

  &.readonly {
    .input {
      border-color: $color-input-border;
    }
  }

  &.required {
    .label {
      &:after {
        content: '*';
      }
    }
  }
}
</style>
