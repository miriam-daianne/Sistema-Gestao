export function Container({ children }) {
  return (
    <div className='flex  justify-center min-h-fit p-9 m-4 bg-[#fdfdfd] rounded-2xl shadow'>
      <div className='p-8 '>
        <h1 className='text-2xl font-bold text-[#333]'>{children}</h1>
      </div>
    </div>
  );
}

