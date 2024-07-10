import React, { useCallback, useState } from "react";
import RangeSlider from './RangeSlider';
import type { Range } from "./RangeSlider";

export function App() {
  const [data, setData] = useState<Range>();

  const onChangeRange = useCallback((range: Range) => {
    setData(range);
  }, []);

  return (
    <React.Fragment>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <RangeSlider originalFn={onChangeRange}/>
    </React.Fragment>
  )
}