// components/auth/DemoAccounts.tsx
export function DemoAccounts() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <p className="text-sm text-gray-600 mb-3 text-center">
        Demo Hesapları:
      </p>
      <div className="space-y-2 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Müdür:</span>
          <code className="bg-gray-100 px-2 py-1 rounded">
            ahmet.gunaydin@admin.com
          </code>
        </div>
        <div className="flex items-center justify-between">
          <span>Öğretmen:</span>
          <code className="bg-gray-100 px-2 py-1 rounded">
            yasemin.bahtiyar@ogretmen.com
          </code>
        </div>
        <div className="flex items-center justify-between">
          <span>Öğrenci:</span>
          <code className="bg-gray-100 px-2 py-1 rounded">
            zeynep.kaya@ogrenci.com
          </code>
        </div>
        <p className="text-center mt-2 text-gray-400">
          Şifre: herhangi bir şey (min. 4 karakter)
        </p>
      </div>
    </div>
  );
}
