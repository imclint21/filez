import { Card, Flex } from "@tremor/react";
import axios from "axios";
import clsx from "clsx";
import { type ChangeEvent, type DragEvent, type FormEvent, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { SiGithub } from "react-icons/si";

import "./App.css";

export default function App() {
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://fil.ez";
	const curlCommand = `curl -F 'file=@${file?.name || "myfile.txt"}' ${origin}`;

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		setIsDragging(true);
	};
	const handleDragLeave = () => setIsDragging(false);

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		setIsDragging(false);
		if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			setFile(event.dataTransfer.files[0]);
			const input = fileInputRef.current;
			if (input) {
				try {
					const dt = new DataTransfer();
					dt.items.add(event.dataTransfer.files[0]);
					input.files = dt.files;
				} catch {
					// Fallback: some older browsers may not allow constructing DataTransfer
					// In that case, we just keep state; the UI will reflect the selection.
				}
			}
			event.dataTransfer.clearData();
		}
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		axios
			.post("/", formData, { headers: { "Content-Type": "multipart/form-data" } })
			.then((res: any) => {
				const fileUrl = res.data;
				navigator.clipboard.writeText(fileUrl).then(() => toast.success("URL copied to clipboard."));
				setFile(null);
				if (fileInputRef.current) fileInputRef.current.value = "";
			})
			.catch(() => toast.error("Unable to upload file."));
	};

	return (
		<main className={"min-h-screen flex flex-col items-center justify-center bg-[#030712] bg-gradient-to-b?from-gray-900 ?to-black text-white p-4"}>
			<h1 className={"text-5xl font-bold mb-2"}>
				fil<span className="text-tremor-brand">.ez</span>
			</h1>
			<p className={"text-gray-400 mb-8"}>Share files. Fast. No bullshit.</p>

			<Card onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`p-6 w-full max-w-md ${isDragging ? "border-2 border-dashed border-tremor-brand" : ""}`}>
				<form onSubmit={handleSubmit} className={""}>
					<Flex flexDirection={"row"} alignItems={"stretch"} className={"gap-4"}>
						<input required type={"file"} name={"file"} ref={fileInputRef} onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)} className={clsx("file:mr-4 file:py-2 w-3/4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tremor-brand file:text-white", "hover:file:bg-tremor-brand-emphasis text-gray-300")} />
						<button type={"submit"} className={"bg-tremor-brand hover:bg-tremor-brand-emphasis text-white font-bold py-2 px-4 rounded-lg transition-colors"}>
							Upload
						</button>
					</Flex>
				</form>
			</Card>

			<Card className={"p-6 w-full max-w-md mt-8"}>
				<h2 className={"text-xl font-semibold mb-2"}>Upload via curl</h2>
				<CopyToClipboard text={curlCommand} onCopy={() => toast("Copied to clipboard.")}>
					<pre className={"bg-white/5 cursor-pointer p-4 rounded text-sm font-mono text-tremor-brand truncate"}>{curlCommand}</pre>
				</CopyToClipboard>
			</Card>

			<footer className={"flex items-center gap-3 mt-10 text-sm text-gray-500"}>
				Powered by XXI, LLC
				<span>&bull;</span>
				<a href={"https://github.com/imclint21/filez"} className={"inline-flex items-center gap-1 hover:text-tremor-brand-emphasis"}>
					<SiGithub size={16} />
					Fork us on GitHub
				</a>
			</footer>
		</main>
	);
}
