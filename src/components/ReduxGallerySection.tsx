import { useEffect } from "react";
import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Users } from "lucide-react";


const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await fetch("https://randomuser.me/api/?results=12");
  const data = await res.json();
  return data.results; 
});


const usersSlice = createSlice({
  name: "users",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});


const store = configureStore({
  reducer: { users: usersSlice.reducer },
});


const GalleryContent = () => {
  const dispatch = useDispatch<any>();
  const { items, loading } = useSelector((state: any) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <section className="py-28 lg:px-4">
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary" />
            <h2 className="md:text-4xl text-xl font-bold">User Gallery</h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer">
            {items.map((user: any, i: number) => (
              <div
                key={i}
                className="glass-card p-4 text-center hover:scale-105 transition-all duration-300"
              >
                <img
                  src={user.picture.large}
                  alt={`${user.name.first} ${user.name.last}`}
                  className="w-24 h-24 mx-auto rounded-full mb-3 border border-white/10 object-cover"
                />
                <h3 className="font-semibold text-lg">
                  {user.name.first} {user.name.last}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  {user.location.country}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ReduxUserGallerySection = () => (
  <Provider store={store}>
    <GalleryContent />
  </Provider>
);

export default ReduxUserGallerySection;

