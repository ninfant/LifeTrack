import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Container from "../../components/layout/Container";

const Profile = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Container>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {user.id ? (
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
              <p className="text-gray-500">No hay información de usuario</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Profile;
