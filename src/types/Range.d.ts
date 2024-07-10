export type Props = {
  props?: Range,
  originalFn: Function,
  delay?: number
};

export type Range = {
  min?: {
    value?: string | number,
    step?: string | number,
    min?: string | number,
    max?: string | number
  },
  max?: {
    value?: string | number,
    step?: string | number,
    min?: string | number,
    max?: string | number
  },
}