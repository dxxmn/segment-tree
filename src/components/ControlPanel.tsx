import React from 'react';
import { useState } from 'react';

interface ControlPanelProps {
  array: number[];
  onArrayChange: (newArray: number[]) => void;
  queryRange: { start: number; end: number };
  onQueryRangeChange: (range: { start: number; end: number }) => void;
  onQuery: () => void;
  queryResult: number | null;
  updateIndex: number;
  onUpdateIndexChange: (index: number) => void;
  updateValue: number;
  onUpdateValueChange: (value: number) => void;
  onUpdate: () => void;
  error: string | null
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  array,
  onArrayChange,
  queryRange,
  onQueryRangeChange,
  onQuery,
  queryResult,
  updateIndex,
  onUpdateIndexChange,
  updateValue,
  onUpdateValueChange,
  onUpdate,
  error
}) => {
  const [arrayInputString, setArrayInputString] = useState(array.join(' '));
  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const inputValue = e.target.value.replace(/[^0-9 ]/g, '');
      setArrayInputString(inputValue);
      const newArray = inputValue
        .split(' ')
        .map(val => parseInt(val.trim()))
        .filter(val => !isNaN(val));

      if (newArray.length > 0) {
        onArrayChange(newArray);
      }
    }
    catch (error) {
      console.error("Invalid input:", error);
    }
  };


  return (
    <div className="bg-white rounded-lg border-1 border-blue-200 shadow-md p-4 mb-6">
      <h2 className="text-xl font-semibold mb-6">Управление</h2>

      <div className="mb-10">
        <label htmlFor="array-input" className="block text-sm font-medium text-gray-700 mb-1">
          Исходный массив:
        </label>
        <input
          id="array-input"
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={arrayInputString}
          onChange={handleArrayInputChange}
          placeholder="Введите числа через пробел, например: 1 3 5 7 9 11"
        />
        <p className="text-xs text-gray-500 mt-1">
          Введите числа через пробел
        </p>
      </div>

      <div className="mb-10">
        <h3 className="font-medium mb-2">Запрос суммы на отрезке</h3>
        <div className="flex space-x-4 mb-2">
          <div>
            <label htmlFor="range-start" className="block text-sm text-gray-700">
              Начало:
            </label>
            <input
              id="range-start"
              className="w-20 p-2 border border-gray-300 rounded"
              value={queryRange.start}
              onChange={(e) => onQueryRangeChange({ ...queryRange, start: parseInt(e.target.value) || 0 })}
              min={0}
              max={array.length - 1}
            />
          </div>
          <div>
            <label htmlFor="range-end" className="block text-sm text-gray-700">
              Конец:
            </label>
            <input
              id="range-end"
              className="w-20 p-2 border border-gray-300 rounded"
              value={queryRange.end}
              onChange={(e) => onQueryRangeChange({ ...queryRange, end: parseInt(e.target.value) || 0 })}
              min={0}
              max={array.length - 1}
            />
          </div>
        </div>
        <button
          className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded"
          onClick={onQuery}
        >
          Запросить сумму
        </button>
        {queryResult !== null && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <p className="font-medium">Результат: {queryResult}</p>
          </div>
        )}
        {error !== null && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <p className="font-medium">Ошибка: {error}</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-medium mb-2">Обновление элемента</h3>
        <div className="flex space-x-4 mb-2">
          <div>
            <label htmlFor="update-index" className="block text-sm text-gray-700">
              Индекс:
            </label>
            <input
              id="update-index"
              className="w-20 p-2 border border-gray-300 rounded"
              value={updateIndex}
              onChange={(e) => onUpdateIndexChange(parseInt(e.target.value) || 0)}
              min={0}
              max={array.length - 1}
            />
          </div>
          <div>
            <label htmlFor="update-value" className="block text-sm text-gray-700">
              Новое значение:
            </label>
            <input
              id="update-value"
              className="w-20 p-2 border border-gray-300 rounded"
              value={updateValue}
              onChange={(e) => onUpdateValueChange(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <button
          className="bg-green-400 hover:bg-green-500 text-white py-2 px-4 rounded"
          onClick={onUpdate}
        >
          Обновить
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
