export function Container({ titulo, subtitulo, children }) {
  return (
    <div className='flex min-h-fit p-4 m-4 bg-[#fdfdfd] rounded-2xl shadow'>
      <div className='p-8 flex gap-2.5 flex-col'>
       <h3 className="text-3xl font-bold text-gray-800 mb-2">{titulo}</h3>
      <p className="text-gray-600 mb-6 text-2xl">{subtitulo}</p>
        <div className='text-2xl'>{children}</div>
      </div>
    </div>
  );
}

