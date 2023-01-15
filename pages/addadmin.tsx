import { addAdmin, checkIsAdmin } from "^lib/firebase/authentication";

const Addadmin = () => {
  async function handleAddAdmin() {
    try {
      addAdmin("sundaravi@hotmail.com");
    } catch (error) {
      console.log("error:", error);
    }
  }

  return (
    <div>
      <button onClick={handleAddAdmin}>ADD ADMIN</button>
      <button
        onClick={async () => {
          const isAdmin = await checkIsAdmin("sundaravi@hotmail.com");
          console.log("isAdmin:", isAdmin);
        }}
      >
        Check
      </button>
    </div>
  );
};

export default Addadmin;
