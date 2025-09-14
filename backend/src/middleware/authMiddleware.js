// backend/src/middleware/authMiddleware.js

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Отсутствует заголовок авторизации' });
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Неверный формат авторизации' });
  }

  const token = tokenParts[1];

  // Здесь можно вставить логику проверки токена, например JWT verify
  // Для простоты, скажем, любой непустой токен считается валидным

  if (!token) {
    return res.status(401).json({ error: 'Токен авторизации отсутствует' });
  }

  // При успешной проверке передаем управление далее
  next();
}
