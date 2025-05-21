import { formatarMoeda } from "../utils/formatadores"; 

export function CardRelatorio({ titulo, subtitulo, valor, infoAdicional, children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm text-gray-500 mb-1">{titulo}</h3>
      <p className="text-xs text-gray-400 mb-2">{subtitulo}</p>
      <div className="text-2xl font-bold text-[#A28567]">
        {typeof valor === 'number' ? formatarMoeda(valor) : valor}
      </div>
      {infoAdicional && (
        <div className="mt-2 text-xs text-gray-500">
          {infoAdicional}
        </div>
      )}
      {children}
    </div>
  );
}