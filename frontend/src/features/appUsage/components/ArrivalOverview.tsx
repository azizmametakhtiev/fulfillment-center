import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import { useAppSelector } from '@/app/hooks.ts'
import { selectUser } from '@/store/slices/authSlice.ts'

const images = [
  '/app-usage/arrivals/arrivals-list.png',
  '/app-usage/arrivals/arrivals-form.png',
  '/app-usage/arrivals/arrivals-details.png',
  '/app-usage/arrivals/arrivals-list(SW).png',
  '/app-usage/arrivals/arrivals-details(SW).png',
]

const ArrivalOverview = () => {
  const user = useAppSelector(selectUser)

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Общее описание функционала поставок</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong>Система управления поставками</strong> позволяет контролировать весь процесс движения товаров:
          от оформления до прибытия на склад, включая обработку дефектов и документооборот.
        </p>

        <div>
          <h3 className="font-semibold">Список поставок</h3>
          <p>
            В таблице отображаются все активные поставки с возможностью сортировки и фильтрации по:
          </p>
          <ul className="list-disc pl-5">
            <li>Номеру поставки</li>
            <li>Клиенту</li>
            <li>Складу назначения</li>
            <li>Дате прибытия</li>
            <li>Статусу</li>
          </ul>
          <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
            <p className="mt-2">
              Доступные действия для каждой поставки:
            </p>
            <ul className="list-disc pl-5">
              <li><strong>«Подробнее»</strong> — открывает полную информацию о поставке</li>
              <li><strong>«Редактировать»</strong> — позволяет изменить данные поставки</li>
              <li><strong>«Архивировать»</strong> — перемещает поставку в архив</li>
              <li><strong>«Отменить»</strong> — при ошибочном создании поставки, удаляет ее из системы</li>
            </ul>
            <p className="mt-2">
              Для удобства на главной странице были добавлены кнопки вызова форм:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>«Добавить товар»</strong> — создания новых товаров</li>
              <li><strong>«Выставить счет»</strong> — формирования счета</li>
            </ul>
          </ProtectedElement>
          <img
            src={user?.role === 'stock-worker' ? images[3] : images[0]}
            alt="Список поставок"
            className="mt-2 rounded-lg border shadow-sm w-5/6 mx-auto"
          />
        </div>

        <div>
          <h3 className="font-semibold">Детальный просмотр поставки</h3>
          <p>
            При переходе к конкретной поставке (кнопка <strong>«Подробнее»</strong>), отображаются следующие данные:
          </p>
          <ul className="list-disc pl-5">
            <li><strong>Основная информация</strong> — номер поставки, статусы доставки и оплаты, дата прибытия,
              клиент и его контакты, склад где будет храниться данная поставка
            </li>
            <li><strong>Вкладки</strong> с детализацией по отправленным, полученным и дефектным товарам, оказанным
              услугам и истории изменений
            </li>
          </ul>
          <img
            src={user?.role === 'stock-worker' ? images[4] : images[2]}
            alt="Детали поставки"
            className="mt-2 rounded-lg border shadow-sm w-5/6 mx-auto"
          />
        </div>

        <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
          <div>
            <h3 className="font-semibold">Создание и редактирование
            </h3>
            <p>Форма поставки состоит из следующих полей:</p>

            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Клиент</strong> — выбор клиента, от которого осуществляется поставка</li>
              <li><strong>Склад</strong> — склад, на который поступает товар</li>
              <li><strong>Компания-перевозчик</strong> — контрагент, осуществляющий транспортировку груза</li>
              <li><strong>Адрес доставки</strong> — место, куда была доставлена поставка</li>
              <li><strong>Статус поставки</strong> — текущий статус поставки (например: "Ожидается доставка",
                "Получена",
                "Отсортирована")
              </li>
              <li><strong>Дата прибытия</strong> — фактическая дата прибытия поставки</li>
              <li><strong>Количество отправленного товара</strong> — текстовое поле, где можно указать единицу измерения
                (например: 3 коробки, 10 мешков)
              </li>
              <li><strong>Полученные товары</strong> — фактически принятые товары</li>
              <li><strong>Дефекты</strong> — товары, которые были получены с дефектами</li>
              <li><strong>Услуги</strong> — услуги, оказанные при поставке. По умолчанию данные
                подставляются автоматически, но при желании можно их корректировать
              </li>
              <li><strong>Документы</strong> — прикреплённые файлы (PDF, Word, Excel), не более 10 МБ каждый</li>
              <li><strong>Комментарии</strong> — внутренние заметки</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Работа с товарами в поставке</h3>
            <p>
              Процесс обработки товаров разделен на этапы:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Добавление отправленных товаров</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>Выбираются из каталога товаров клиента</li>
                  <li>Указывается точное количество</li>
                </ul>
              </li>
              <li>
                <strong>Фиксация полученных товаров</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>Доступно после изменения статуса на «Получена»</li>
                  <li>Все полученные товары автоматически сохраняются в системе, в разделе «Склад» во вкладке «Товары»</li>
                </ul>
              </li>
              <li>
                <strong>Регистрация дефектов</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>Добавляются при статусе «Отсортирована»</li>
                  <li>Требуется описание проблемы</li>
                  <li>Все дефектные товары автоматически сохраняются в системе, в разделе «Склад» во вкладке «Брак»</li>
                </ul>
              </li>
            </ol>
            <p className="mt-2">
              Для редактирования используется аналогичная форма.
            </p>
            <img
              src={images[1]}
              alt="Форма поставок"
              className="mt-2 rounded-lg border shadow-sm w-5/6 mx-auto"
            />
          </div>

          <div>
            <h3 className="font-semibold">Архивация</h3>
            <p>
              Неактуальные поставки можно архивировать (кнопка <strong>«Архивировать»</strong>). Такие поставки
              перемещаются в архив и исключаются из основного списка. Важно отметить, что архивировать можно только
              полностью оплаченные поставки.
            </p>
          </div>
        </ProtectedElement>

        <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800">Особенности работы</h3>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>Изменение статуса поставки влияет на доступные действия</li>
              <li>Гибкое управление услугами с возможностью переопределения цен</li>
              <li>Все изменения фиксируются в истории</li>
            </ul>
          </div>
        </ProtectedElement>
      </CardContent>
    </Card>
  )
}

export default ArrivalOverview
