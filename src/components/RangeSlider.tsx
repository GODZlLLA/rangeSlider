import React, { ReactElement, useCallback, useLayoutEffect, useRef } from "react";
import { useDebounce } from './use-debounce';
import type { Props, Range as range } from '../types/Range';

function RangeSlider({ props = {}, originalFn, delay = 300 }: Props): ReactElement {
  const debounce = useDebounce(delay);
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  const sliderRangeRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { min, max } = {
    min: Object.assign({
      value: 0,
      min: 0,
      max: 50000,
      step: 5000
    }, props.min),
    max: Object.assign({
      value: 50000,
      min: 0,
      max: 50000,
      step: 5000
    }, props.max)
  };

  const updateSlider = useCallback(() => {
    const minRange = minRef.current;
    const maxRange = maxRef.current;
    const sliderRange = sliderRangeRef.current;
    const minValue = parseInt(minRange.value);
    const maxValue = parseInt(maxRange.value);

    // 上限同士が衝突した際に、マイナス値に突入するを防ぐ
    if (minValue > maxValue - 1) {
      minRange.value = String(maxValue - 1);
    }

    if (maxValue < minValue + 1) {
      maxRange.value = String(minValue + 1);
    }

    const minPercent = (minValue / +minRange.max) * 100;
    const maxPercent = (maxValue / +maxRange.max) * 100;

    sliderRange.style.left = minPercent + '%';
    sliderRange.style.right = (100 - maxPercent) + '%';

    debounce(() => originalFn({ min: minValue, max: maxValue }));
  }, []);

  // スライダー部分をクリックする座標の近い方がクリック位置に移動する
  const onClickRange = useCallback((e: React.MouseEvent) => {
    const x = e.pageX;
    const minRange = minRef.current;
    const maxRange = maxRef.current;
    const sliderRange = sliderRangeRef.current;
    const slider = ref.current;

    const sliderRect = slider.getBoundingClientRect();
    const sliderWidth = sliderRect.width;

    // 現在の最小値と最大値をスライダーから取得
    const minValue = parseInt(minRange.value);
    const maxValue = parseInt(maxRange.value);

    // スライダーの値を0-100%の範囲に変換
    const minPercent = (minValue / +minRange.max) * 100;
    const maxPercent = (maxValue / +maxRange.max) * 100;

    // スライダーの最小値と最大値のハンドルの実際のX座標
    const minX = sliderRect.left + (minPercent / 100) * sliderWidth;
    const maxX = sliderRect.left + (maxPercent / 100) * sliderWidth;

    // クリックされた位置（x）と各ハンドルの距離を計算(動いてるからヨシ!!)
    const distanceToMin = Math.abs(x - minX);
    const distanceToMax = Math.abs(x - maxX);

    // 一番近いスライダーを移動
    // (x - sliderRect.left): クリックされたX座標からスライダーの左端の位置を引いて、スライダー内でのクリック位置を計算
    // (** / sliderWidth): 上記の結果をスライダーの幅で割ることで、クリック位置を0から1の範囲に正規化
    // * +[min/max]Range.max: 正規化された値に最大値をかけて、実際のスライダーの値の範囲に変換
    if (distanceToMin < distanceToMax) {
      minRange.value = String(Math.round((x - sliderRect.left) / sliderWidth * +minRange.max));
      const minRangeValue = (+minRange.value / +maxRange.max) * 100;
      sliderRange.style.left = Math.round(minRangeValue) + '%';
    } else {
      maxRange.value = String(Math.round((x - sliderRect.left) / sliderWidth * +maxRange.max));
      const maxRangeValue = (+maxRange.value / +maxRange.max) * 100;
      sliderRange.style.right = Math.round((100 - maxRangeValue)) + '%';
    }

    debounce(() => originalFn({ min: +minRange.value, max: +maxRange.value }));
  }, [])

  useLayoutEffect(() => {
    // 初期状態のスライダーを更新
    updateSlider();
  }, []);

  return (
    <div className="el-range-slider" ref={ref}>
      <input type="range" min={min.min} max={min.max} step={min.step} defaultValue={min.value} ref={minRef} onInput={updateSlider} />
      <input type="range" min={max.min} max={max.max} step={max.step} defaultValue={max.value} ref={maxRef} onInput={updateSlider} />
      <div className="slider" onClick={onClickRange}>
        <div className="slider__range" ref={sliderRangeRef} />
      </div>
    </div>
  )
};

export default React.memo(RangeSlider);
export type Range = range;