import { useEffect, useState } from 'react';

function App() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchCars() {
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
    fetchCars();
  }, []);

  return (
    // 배경을 아주 연한 딸기우유 색(rose-50)으로 조정
    <main className="max-w-4xl mx-auto p-8 bg-rose-50 min-h-screen">
      <section className="mb-8">
        {/* 텍스트도 톤다운된 장미빛(rose-400)으로 변경 */}
        <p className="text-rose-400 font-bold text-xs uppercase tracking-widest mb-2">Express REST API</p>
        <h1 className="text-4xl font-extrabold text-slate-800">자동차 목록</h1>
      </section>

      {isLoading && <div className="text-center p-10 bg-white rounded-3xl shadow-sm border border-rose-100 text-rose-400">데이터를 불러오는 중입니다...</div>}
      
      {!isLoading && !errorMessage && (
        // 전체적으로 부드러운 화이트와 연한 핑크 테두리 조화
        <div className="bg-white border border-rose-100 rounded-3xl shadow-xl shadow-rose-100/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-rose-50/50 border-b border-rose-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-rose-400">이름</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-rose-400">제조사</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-rose-400">연식</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-rose-400">가격</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default App;