export function Container({ children }) {
  return (
    <div className='flex min-h-fit p-4 m-4 bg-[#fdfdfd] rounded-2xl shadow'>
      <div className='flex gap-2.5 flex-col'>
  
        <div className='text-2xl'>{children}</div>
      </div>
    </div>
  );
}

