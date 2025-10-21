
import { useEffect } from "react";
import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Film } from "lucide-react";


const fetchShows = createAsyncThunk("shows/fetch", async () => {
  const res = await fetch("https://api.tvmaze.com/shows");
  const data = await res.json();
  return data.slice(0, 12); 
});


const showsSlice = createSlice({
  name: "shows",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShows.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShows.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchShows.rejected, (state) => {
        state.loading = false;
      });
  },
});


const store = configureStore({
  reducer: { shows: showsSlice.reducer },
});


const MoviesContent = () => {
  const dispatch = useDispatch<any>();
  const { items, loading } = useSelector((state: any) => state.shows);

  useEffect(() => {
    dispatch(fetchShows());
  }, [dispatch]);

  return (
    <section className="py-28 lg:px-4">
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-8 h-8 text-primary" />
            <h2 className="md:text-4xl text-xl font-bold">Movie Explorer</h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((show: any) => (
              <div
                key={show.id}
                className="glass-card p-3 hover:scale-105 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <img
                  src={show.image?.medium || "https://placehold.co/300x400"}
                  alt={show.name}
                  className="rounded-xl mb-3 w-full object-cover aspect-[3/4]"
                />
                <h3 className="font-semibold text-lg line-clamp-1">{show.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {show.genres?.join(", ") || "No genres"}
                </p>
                <p
                  className="text-sm text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: show.summary || "No description available.",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// --- Provider wrapper
const ReduxMoviesSection = () => (
  <Provider store={store}>
    <MoviesContent />
  </Provider>
);

export default ReduxMoviesSection;
