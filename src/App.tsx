import { useState } from 'react'
import { SegmentTree } from './utils/SegmentTree'
import SegmentTreeVisualization from './components/Visualization'
import ControlPanel from './components/ControlPanel'
import ArrayDisplay from './components/ArrayDisplay'

function App() {
  const [array, setArray] = useState<number[]>([1, 3, 5, 7, 9, 11])
  const [segmentTree, setSegmentTree] = useState<SegmentTree>(new SegmentTree(array))
  const [queryRange, setQueryRange] = useState<{ start: number; end: number }>({ start: 1, end: 4 })
  const [queryResult, setQueryResult] = useState<number | null>(null)
  const [updateIndex, setUpdateIndex] = useState<number>(0)
  const [updateValue, setUpdateValue] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [highlightPath, setHighlightPath] = useState<boolean>(false)
  const [visualizedQueryRange, setVisualizedQueryRange] = useState<{ start: number; end: number }>({ start: 0, end: 2 })

  const handleArrayChange = (newArray: number[]) => {
    setArray(newArray)
    setSegmentTree(new SegmentTree(newArray))
    setQueryResult(null)
    setHighlightPath(false)
  };

  const handleQuery = () => {
    try {
      const result = segmentTree.querySum(queryRange.start, queryRange.end)
      setQueryResult(result)
      setError(null)
      setVisualizedQueryRange({ ...queryRange })
      setHighlightPath(true)
    }
    catch (error) {
      console.error(error)
      setQueryResult(null)
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  };

  const handleUpdate = () => {
    if (updateIndex >= 0 && updateIndex < array.length) {
      const newArray = [...array]
      newArray[updateIndex] = updateValue
      setArray(newArray)

      segmentTree.update(updateIndex, updateValue)
      setSegmentTree(new SegmentTree(newArray))

      setQueryResult(null)
      setHighlightPath(false)
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className='bg-white shadow-md rounded-lg border-1 border-blue-200 p-4 mb-6'>
        <h1 className="text-2xl font-bold text-center">Дерево отрезков</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ControlPanel
            array={array}
            onArrayChange={handleArrayChange}
            queryRange={queryRange}
            onQueryRangeChange={setQueryRange}
            onQuery={handleQuery}
            queryResult={queryResult}
            updateIndex={updateIndex}
            onUpdateIndexChange={setUpdateIndex}
            updateValue={updateValue}
            onUpdateValueChange={setUpdateValue}
            onUpdate={handleUpdate}
            error={error}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md border-1 border-blue-200 p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Визуализация дерева отрезков</h2>
          <SegmentTreeVisualization segmentTree={segmentTree} highlightPath={highlightPath} queryRange={visualizedQueryRange} />
        </div>
      </div>

      <div className='grid gap-6'>
        <ArrayDisplay
          array={array}
          queryRange={queryRange}
          updateIndex={updateIndex}
        />
      </div>
    </div>
  );
}

export default App
