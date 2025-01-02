
export const Button = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => {
  return <button onClick={onClick} className="mt-8 bg-green-400 hover:bg-green-600 text-white font-bold py-4 px-8 text-2xl rounded">
    {children}
  </button>

}
