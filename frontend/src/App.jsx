import { useEffect, useState } from 'react';

const initialNewCar = {
  name: '',
  company: '',
  year: '',
  price: '',
};

function App() {
  const [cars, setCars] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [newCar, setNewCar] = useState(initialNewCar);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadCars() {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/cars');
      if (!response.ok) throw new Error('데이터 로드 실패');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function searchCars(keyword) {
    const trimmedKeyword = keyword.trim();
    const queryString = `?q=${encodeURIComponent(trimmedKeyword)}`;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/cars/search${queryString}`);
      if (!response.ok) throw new Error('데이터 로드 실패');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCars();
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();

    if (!searchKeyword.trim()) {
      setErrorMessage('');
      setCars([]);
      return;
    }

    searchCars(searchKeyword);
  }

  function handleResetSearch() {
    setSearchKeyword('');
    loadCars();
  }

  function handleNewCarChange(event) {
    const { name, value } = event.target;

    setNewCar((currentCar) => ({
      ...currentCar,
      [name]: value,
    }));
  }

  async function handleAddCar(event) {
    event.preventDefault();

    if (!newCar.name.trim() || !newCar.company.trim() || !newCar.year || !newCar.price) {
      setErrorMessage('자동차 정보를 모두 입력해 주세요.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCar),
      });

      if (!response.ok) throw new Error('자동차 추가 실패');

      setNewCar(initialNewCar);
      await loadCars();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteCar(id) {
    setErrorMessage('');

    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('자동차 삭제 실패');

      await loadCars();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    // 배경을 아주 연한 딸기우유 색(rose-50)으로 조정
    <main className="max-w-5xl mx-auto p-8 bg-rose-50 min-h-screen">
      <section className="mb-8">
        {/* 텍스트도 톤다운된 장미빛(rose-400)으로 변경 */}
        <p className="text-rose-400 font-bold text-xs uppercase tracking-widest mb-2">Express REST API</p>
        <h1 className="text-4xl font-extrabold text-slate-800">자동차 목록</h1>
      </section>

      <form onSubmit={handleAddCar} className="mb-6 grid gap-3 rounded-lg border border-rose-100 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <input
          name="name"
          value={newCar.name}
          onChange={handleNewCarChange}
          placeholder="이름"
          className="min-h-12 rounded-lg border border-rose-100 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
        />
        <input
          name="company"
          value={newCar.company}
          onChange={handleNewCarChange}
          placeholder="제조사"
          className="min-h-12 rounded-lg border border-rose-100 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
        />
        <input
          name="year"
          type="number"
          value={newCar.year}
          onChange={handleNewCarChange}
          placeholder="연식"
          className="min-h-12 rounded-lg border border-rose-100 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
        />
        <input
          name="price"
          type="number"
          value={newCar.price}
          onChange={handleNewCarChange}
          placeholder="가격"
          className="min-h-12 rounded-lg border border-rose-100 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
        />
        <button
          type="submit"
          disabled={isSaving}
          className="min-h-12 rounded-lg bg-slate-800 px-5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSaving ? '추가 중' : '추가'}
        </button>
      </form>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          placeholder="이름 또는 제조사 검색"
          className="min-h-12 flex-1 rounded-lg border border-rose-100 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="min-h-12 rounded-lg bg-rose-400 px-5 text-sm font-bold text-white transition hover:bg-rose-500"
          >
            검색
          </button>
          <button
            type="button"
            onClick={handleResetSearch}
            className="min-h-12 rounded-lg border border-rose-100 bg-white px-5 text-sm font-bold text-rose-400 transition hover:bg-rose-50"
          >
            초기화
          </button>
        </div>
      </form>

      {isLoading && <div className="text-center p-10 bg-white rounded-3xl shadow-sm border border-rose-100 text-rose-400">데이터를 불러오는 중입니다...</div>}
      {errorMessage && <div className="mb-6 text-center p-4 bg-white rounded-lg shadow-sm border border-rose-100 text-red-400">{errorMessage}</div>}

      {!isLoading && (
        // 전체적으로 부드러운 화이트와 연한 핑크 테두리 조화
        <div className="bg-white border border-rose-100 rounded-3xl shadow-xl shadow-rose-100/50 overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-rose-50/50 border-b border-rose-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-rose-400">이름</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-rose-400">제조사</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-rose-400">연식</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-rose-400">가격</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-rose-400">관리</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id} className="border-b border-rose-50 hover:bg-rose-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{car.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{car.company}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{car.year}</td>
                  {/* 가격은 포인트 컬러로 살짝만 강조 */}
                  <td className="px-6 py-4 text-sm font-bold text-rose-400">{car.price.toLocaleString()}만원</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteCar(car._id)}
                      className="rounded-lg border border-red-100 bg-white px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {cars.length === 0 && (
            <div className="border-t border-rose-50 p-10 text-center text-sm font-medium text-slate-500">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
