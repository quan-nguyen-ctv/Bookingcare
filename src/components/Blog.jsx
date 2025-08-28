
import React from "react";

const mockPosts = [
  {
    id: 1,
    title: "Chọn dịch vụ chất lượng thay vì dịch vụ giá rẻ cho mọi nhu cầu",
    date: "22 tháng 1",
    comments: 9,
    img: "/images/blog-1.jpg",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis aliquid ad architecto facere commodi cupiditate omnis voluptatibus inventore major vitae rerum rem ex! Iure id assumenda eum accusamus ipsum ex porro, dicta est.",
  },
];

const popularPosts = [
  { id: 1, title: "Bài viết số 1 - 2021" },
  { id: 2, title: "Hình ảnh y tế phụ nữ tại Los Angeles" },
  { id: 3, title: "Nha khoa bảo vệ đẳng cấp thế giới" },
  { id: 4, title: "Bác sĩ phẫu thuật nha khoa giỏi nhất" },
];

const categories = [
  { name: "Y học", count: 14 },
  { name: "Trang thiết bị", count: 6 },
  { name: "Tim mạch", count: 16 },
  { name: "Tư vấn miễn phí", count: 5 },
  { name: "Mới nhất", count: 8 },
];

const tags = ["Y tế", "Bác sĩ", "Sức khỏe", "Nha khoa", "Phẫu thuật", "Chăm sóc"];

const Blog = () => (
  <main className="bg-white min-h-screen">
    {/* Banner */}
    <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8 mt-7">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
      ></div>
      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Bài viết Blog
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
                      {post.comments} Bình luận
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
                  Đọc thêm
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar */}
        <aside className="w-full md:w-80 flex-shrink-0">
          {/* Search */}
          <div className="mb-8">
            <h3 className="font-bold text-[#223a66] mb-2">Tìm kiếm</h3>
            <input
              type="text"
              placeholder="Nhập từ khóa..."
              className="w-full p-2 border border-gray-200 rounded"
            />
          </div>
          {/* Popular Posts */}
          <div className="mb-8">
            <h3 className="font-bold text-[#223a66] mb-2">Bài viết phổ biến</h3>
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
            <h3 className="font-bold text-[#223a66] mb-2">Danh mục</h3>
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
            <h3 className="font-bold text-[#223a66] mb-2">Thẻ</h3>
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
