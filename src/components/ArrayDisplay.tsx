import React from 'react';

interface ArrayDisplayProps {
  array: number[];
  queryRange: { start: number; end: number };
  updateIndex: number;
}

const ArrayDisplay: React.FC<ArrayDisplayProps> = ({ array, queryRange, updateIndex }) => {
  return (
    <div className="bg-white rounded-lg border-1 border-blue-200 shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Исходный массив</h2>
      <div className="flex flex-wrap gap-2">
        {array.map((value, index) => {
          const isInQueryRange = index >= queryRange.start && index <= queryRange.end;
          const isUpdateIndex = index === updateIndex;

          let bgColor = 'bg-gray-100';
          if (isInQueryRange) bgColor = 'bg-blue-100';
          if (isUpdateIndex) bgColor = 'bg-green-100';

          return (
            <div
              key={index}
              className={`${bgColor} border p-3 rounded-md min-w-[60px] text-center`}
            >
              <div className="text-xs text-gray-500 mb-1">{index}</div>
              <div className="font-medium">{value}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <span className="inline-block w-3 h-3 bg-blue-100 mr-1"></span> Запрашиваемый диапазон
        <span className="inline-block w-3 h-3 bg-green-100 ml-3 mr-1"></span> Обновляемый элемент
      </div>
    </div>
  );
};

export default ArrayDisplay;
