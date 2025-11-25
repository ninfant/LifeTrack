interface ProfileProps {
  user?: {
    id: string | null;
    name: string | null;
    email: string | null;
  };
}

const Profile = ({ user }: ProfileProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {user?.id ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Nombre
              </label>
              <p className="text-lg">{user.name || "No disponible"}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email
              </label>
              <p className="text-lg">{user.email || "No disponible"}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                ID de Usuario
              </label>
              <p className="text-sm text-gray-500">{user.id}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No hay información de usuario</p>
            <p className="text-sm text-gray-400">
              Configura tu usuario en el store de Redux
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
