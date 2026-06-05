import { login } from '@/actions/auth';

export default function LoginPage() {
  return (
    <form
      className="min-h-screen bg-gray-400 flex items-center justify-center"
      action={login}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Вход в систему
        </h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              Пароль
            </label>
            <input
              required
              autoFocus
              type="password"
              id="password"
              name="password"
              placeholder="Введите пароль"
              className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Войти
          </button>
        </div>
      </div>
    </form>
  );
}
