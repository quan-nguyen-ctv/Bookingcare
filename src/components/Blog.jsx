import React from "react";

const mockPosts = [
  {
    id: 1,
    title: "Choose quality service over cheap service all type of things",
    date: "22th January",
    comments: 9,
    img: "/images/blog-1.jpg",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis aliquid ad architecto facere commodi cupiditate omnis voluptatibus inventore major vitae rerum rem ex! Iure id assumenda eum accusamus ipsum ex porro, dicta est.",
  },
];

const popularPosts = [
  { id: 1, title: "Blog one 2021" },
  { id: 2, title: "Woman medical imaging Los Angeles" },
  { id: 3, title: "World class dental guard." },
  { id: 4, title: "Best dental surgeon and super angels" },
];

const categories = [
  { name: "Medicine", count: 14 },
  { name: "Equipments", count: 6 },
  { name: "Heart", count: 16 },
  { name: "Free counseling", count: 5 },
  { name: "Latest", count: 8 },
];

const tags = ["Medical", "Doctor", "Health", "Dental", "Surgery", "Care"];

const Blog = () => (
  <main className="bg-white min-h-screen">
    {/* Banner */}
    <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
      ></div>
      <div className="relative z-10 text-center">
        <div className="text-white text-sm mb-1">Our blog</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Blog Articles
        </h1>
      </div>
    </section>

    {/* Blog Content */}
    <section className="container mx-auto px-4 mb-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Blog Posts */}
        <div className="flex-1">
          {mockPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow p-6 mb-8  flex-col md:flex-row gap-6 "
            >
              <img
                src={post.img}
                alt={post.title}
                className="w-full md:w-full h-[395px] object-cover rounded"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-sm text-[#6f8ba4] mb-2">
                    <span>
                      <i className="fa fa-comments-o mr-1"></i>
                      {post.comments} Comments
                    </span>
                    <span>
                      <i className="fa fa-calendar mr-1"></i>
                      {post.date}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#223a66] mb-2">
                    {post.title}
                  </h2>
                  <p className="text-[#6f8ba4] mb-4">{post.excerpt}</p>
                </div>
                <button className="bg-[#223a66] hover:bg-[#f75757] text-white px-6 py-2 rounded font-semibold transition w-fit">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar */}
        <aside className="w-full md:w-80 flex-shrink-0">
          {/* Search */}
          <div className="mb-8">
            <h3 className="font-bold text-[#223a66] mb-2">Search here</h3>
            <input
              type="text"
              placeholder="search"
              className="w-full p-2 border border-gray-200 rounded"
            />
          </div>
          {/* Popular Posts */}
          <div className="mb-8">
            <h3 className="font-bold text-[#223a66] mb-2">Popular Posts</h3>
            <ul className="space-y-2">
              {popularPosts.map((p) => (
                <li key={p.id} className="text-[#6f8ba4] text-sm hover:text-[#f75757] cursor-pointer">
                  {p.title}
                </li>
              ))}
            </ul>
          </div>
          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-bold text-[#223a66] mb-2">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat, idx) => (
                <li key={idx} className="flex justify-between text-[#6f8ba4] text-sm">
                  <span>{cat.name}</span>
                  <span>({cat.count})</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Tags */}
          <div>
            <h3 className="font-bold text-[#223a66] mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-[#223a66] px-3 py-1 rounded text-xs cursor-pointer hover:bg-[#f75757] hover:text-white transition"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  </main>
);

export default Blog;