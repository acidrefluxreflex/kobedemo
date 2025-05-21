import Link from "next/link"

export function Logo() {
  return (
    <div className="p-4">
      <Link href="/" className="text-blue-500 font-bold text-xl">
        RAG-BASE
      </Link>
    </div>
  )
}
