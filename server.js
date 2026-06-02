// Express 모듈을 불러와서 서버를 만들 준비를 합니다.
const express = require('express');
const path = require('path');


// app은 Express 서버의 주요 기능을 담고 있는 객체입니다.
const app = express();

// React 빌드 결과물이 만들어지는 폴더입니다.
const frontendBuildPath = path.join(__dirname, 'frontend', 'dist');

// JSON 형식의 요청 body를 req.body에서 사용할 수 있게 합니다.
app.use(express.json());

// Render 같은 배포 환경에서는 PORT 환경 변수를 사용하고, 로컬에서는 3000번을 사용합니다.
const PORT = process.env.PORT || 3000;

// 서버가 처음 시작할 때 사용할 자동차 목록 데이터입니다.
let cars = [
  { _id: 1, name: 'Sonata', price: 2500, company: 'HYUNDAI', year: 2023 },
  { _id: 2, name: 'K5', price: 2700, company: 'KIA', year: 2024 },
  { _id: 3, name: 'SM6', price: 2300, company: 'RENAULT', year: 2022 },
];

// 전체 자동차 목록을 JSON으로 응답합니다.
app.get('/cars', (req, res) => {
  res.json(cars);
});

function searchCars(keyword) {
  if (!keyword) {
    return cars;
  }

  const lowerKeyword = keyword.toLowerCase();

  return cars.filter((item) => {
    return item.name.toLowerCase().includes(lowerKeyword)
      || item.company.toLowerCase().includes(lowerKeyword);
  });
}

function createCar(carData) {
  const maxId = cars.reduce((max, item) => Math.max(max, item._id), 0);

  return {
    _id: maxId + 1,
    name: carData.name,
    price: Number(carData.price),
    company: carData.company,
    year: Number(carData.year),
  };
}

function deleteCar(id) {
  const carIndex = cars.findIndex((item) => item._id === id);

  if (carIndex === -1) {
    return null;
  }

  return cars.splice(carIndex, 1)[0];
}

// 이름 또는 제조사 쿼리와 일치하는 자동차 목록을 검색합니다.
app.get('/cars/search', (req, res) => {
  const keyword = req.query.q || req.query.company || '';

  res.json(searchCars(keyword));
});

// React 개발 서버와 통합 실행 환경에서 모두 /api/cars/search로 검색할 수 있게 합니다.
app.get('/api/cars/search', (req, res) => {
  const keyword = req.query.q || req.query.company || '';

  res.json(searchCars(keyword));
});

// 가격 범위에 해당하는 자동차 목록을 필터링합니다.
app.get('/cars/filter', (req, res) => {
  const { minPrice, maxPrice } = req.query;
  const min = minPrice ? Number(minPrice) : null;
  const max = maxPrice ? Number(maxPrice) : null;

  const filteredCars = cars.filter((item) => {
    if (min !== null && item.price < min) {
      return false;
    }

    if (max !== null && item.price > max) {
      return false;
    }

    return true;
  });

  res.json(filteredCars);
});

// React 개발 서버와 통합 실행 환경에서 모두 /api/cars로 목록을 조회할 수 있게 합니다.
app.get('/api/cars', (req, res) => {
  res.json(cars);
});

// URL의 id와 일치하는 자동차 한 대를 찾아 응답합니다.
app.get('/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const car = cars.find((item) => item._id === id);

  if (!car) {
    return res.status(404).json({ message: 'Car not found' });
  }

  res.json(car);
});

// 요청 body로 받은 자동차 정보를 목록에 새로 추가합니다.
app.post('/cars', (req, res) => {
  const newCar = createCar(req.body);
  cars.push(newCar);

  res.status(201).json(newCar);
});

// React 앱에서도 같은 추가 기능을 사용할 수 있게 합니다.
app.post('/api/cars', (req, res) => {
  const newCar = createCar(req.body);
  cars.push(newCar);

  res.status(201).json(newCar);
});

// URL의 id와 일치하는 자동차 정보를 요청 body의 값으로 수정합니다.
app.put('/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const carIndex = cars.findIndex((item) => item._id === id);

  if (carIndex === -1) {
    return res.status(404).json({ message: 'Car not found' });
  }

  const updatedCar = { ...cars[carIndex], ...req.body, _id: id };
  cars[carIndex] = updatedCar;

  res.json(updatedCar);
});

// URL의 id와 일치하는 자동차를 목록에서 삭제합니다.
app.delete('/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const deletedCar = deleteCar(id);

  if (!deletedCar) {
    return res.status(404).json({ message: 'Car not found' });
  }

  res.json(deletedCar);
});

// React 앱에서도 같은 삭제 기능을 사용할 수 있게 합니다.
app.delete('/api/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const deletedCar = deleteCar(id);

  if (!deletedCar) {
    return res.status(404).json({ message: 'Car not found' });
  }

  res.json(deletedCar);
});

// React 앱을 빌드한 뒤에는 Express가 같은 포트에서 화면 파일도 제공합니다.
app.use(express.static(frontendBuildPath));

// API가 아닌 모든 GET 요청은 React 앱의 index.html로 보냅니다.
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// 설정된 포트에서 서버를 실행하고, 실행되면 콘솔에 주소를 출력합니다.
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
