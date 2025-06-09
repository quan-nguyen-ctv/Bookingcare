import React, { useState } from "react";

const tabData = [
	{
		icon: "flaticon-chiropractic",
		title: "Spinal Manipulation",
		img: "/images/service-1.jpg",
		desc: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.",
	},
	{
		icon: "flaticon-electrotherapy",
		title: "Electrotherapy",
		img: "/images/service-4.jpg",
		desc: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.",
	},
	{
		icon: "flaticon-lymph-nodes",
		title: "Manual Lymphatic",
		img: "/images/service-3.jpg",
		desc: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.",
	},
	{
		icon: "flaticon-acupuncture",
		title: "Medical Acupuncture",
		img: "/images/service-2.jpg",
		desc: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.",
	},
	{
		icon: "flaticon-examination",
		title: "Therapeutic Exercise",
		img: "/images/service-1.jpg",
		desc: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.",
	},
	{
		icon: "flaticon-bone",
		title: "Joint Mobilization",
		img: "/images/service-1.jpg",
		desc: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.",
	},
];

const MedicalServices = () => {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<main className="bg-white min-h-screen">
			{/* Banner */}
			{/* <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
				<div
					className="absolute inset-0 bg-cover bg-center opacity-20"
					style={{
						backgroundImage: "url('/images/about-banner.jpg')",
					}}
				></div>
				<div className="relative z-10 text-center">
					<div className="text-white text-sm mb-1">Our services</div>
					<h1 className="text-3xl md:text-4xl font-bold text-white">
						All Department Care Department
					</h1>
				</div>
			</section> */}

			{/* Section Title */}
			<section className="container mx-auto px-4 mb-5">
				<div className="text-center mb-8">
					{/* <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
						Services
					</span> */}
					<h2 className="text-2xl md:text-3xl font-bold text-[#223a66] ">
				Award winning patient care
					</h2>
					<div className="w-16 h-1 bg-[#f5f1f1] mx-auto mb-4 rounded"></div>
					<p className="text-[#6f8ba4] max-w-2xl mx-auto">
					  Let us better understand the need for pain so that we can become more resilient, even as joy gets entangled in the troubles of those who praise us. Let him seek greater things.
					</p>
				</div>
				{/* Tabs */}
				<div className="flex flex-col md:flex-row gap-8 mt-8">
					{/* Tab List */}
					<div className="md:w-1/3 w-full"> 
						<ul className="flex md:flex-col flex-row gap-2 md:gap-0">
							{tabData.map((tab, idx) => (
								<li key={tab.title}>
									<button
										className={`w-full flex items-center py-4 px-4 text-left rounded transition font-semibold text-[#223a66] ${
											activeTab === idx
												? "bg-[#f75757] text-white cursor-default"
												: "hover:bg-[#f5f5f5] cursor-pointer"
										}`}
										onClick={() => setActiveTab(idx)}
										disabled={activeTab === idx}
									>
										<span className={`${tab.icon} text-2xl mr-3`}></span>
										{tab.title}
									</button>
								</li>
							))}
						</ul>
					</div>
					{/* Tab Content */}
					<div className="md:w-2/3 w-full">
						<div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
							<div
								className="w-full h-[320px] md:h-[380px] bg-cover bg-center rounded-lg mb-6 transition-all duration-300"
								style={{
									backgroundImage: `url('${tabData[activeTab].img}')`,
								}}
							></div>
							<h3 className="text-2xl font-bold text-[#223a66] mb-2">
								{tabData[activeTab].title}
							</h3>
							<p className="text-[#6f8ba4] text-center">
								{tabData[activeTab].desc}
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default MedicalServices;