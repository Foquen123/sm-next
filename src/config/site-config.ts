export const baseUrl = '/schedule';

export const siteConfig: { menuUrls: { url: string; name: string }[] } = {
  menuUrls: [
    {
      url: baseUrl + '/',
      name: 'Стандартное расписание',
    },
    {
      url: baseUrl + '/change-schedule',
      name: 'Изменить расписание',
    },
    {
      url: baseUrl + '/lessons',
      name: 'Уроки',
    },
    {
      url: baseUrl + '/teachers',
      name: 'Учителя',
    },
    {
      url: baseUrl + '/subjects',
      name: 'Предметы',
    },
    {
      url: baseUrl + '/classrooms',
      name: 'Кабинеты',
    },
  ],
};
