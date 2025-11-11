export function ErrorMessage({ erro }: { erro: string }) {
    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">Erro ao carregar perfil</h3>
            <p className="text-red-600">{erro}</p>
        </div>
    );
}