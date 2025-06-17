const pricingData = [
  { type: 'Реферат', price: '499 руб.' },
  { type: 'Проект', price: '499 руб.' },
  { type: 'Курсовая работа', price: '759 руб.' },
  { type: 'Дипломная работа бакалавра', price: '899 руб.' },
  { type: 'Дипломная работа специалиста', price: '999 руб.' },
  { type: 'Магистерская диссертация', price: '1299 руб.' }
];

export function PricingSection() {
  return (
    <section className="py-20 deeplom-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Цены полных версий сгенерированных работ
        </h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип работы
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pricingData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="text-sm text-gray-600 mt-4">
          *При использовании пользовательского оглавления цена формируется исходя из количества глав и может отличаться от цен в таблице.
        </p>
      </div>
    </section>
  );
}
