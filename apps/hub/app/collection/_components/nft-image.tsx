"use client";

import type { ExtendedNft } from "@/app/collection/_server/get-nfts";
import Image from "next/image";
import { useState } from "react";

export function NftImage({ nft }: { nft: ExtendedNft }) {
	const [error, setError] = useState<string | null>(null);

	if (error) {
		console.log(nft.alchemyImage);
		if (nft.alchemyImage?.pngUrl) {
			return (
				<Image
					src={nft.alchemyImage.pngUrl}
					alt={nft.name ?? "Unnamed NFT"}
					width={200}
					height={200}
					className="aspect-square w-full object-cover"
				/>
			);
		}

		return (
			<div className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-muted">
				<div className="text-gray-500">Error: {error}</div>
			</div>
		);
	}

	if (nft.alchemyImage?.cachedUrl) {
		const type = nft.alchemyImage?.contentType;

		if (
			type?.startsWith("image/") ||
			type === "png" ||
			type === "gif" ||
			type === "jpeg"
		) {
			if (type === "image/svg+xml" || type === "svg") {
				return (
					<Image
						onError={(e) => {
							console.error(e);
							setError("Failed to load image");
						}}
						src={nft.alchemyImage.cachedUrl}
						alt={nft.name ?? "Unnamed NFT"}
						width={200}
						height={200}
						className="aspect-square w-full object-cover"
						unoptimized
					/>
				);
			}

			return (
				<Image
					onError={(e) => {
						console.error(e);
						setError("Failed to load image");
					}}
					src={nft.alchemyImage.cachedUrl}
					alt={nft.name ?? "Unnamed NFT"}
					width={200}
					height={200}
					className="aspect-square w-full object-cover"
				/>
			);
		}

		if (type?.startsWith("video/")) {
			return (
				<video
					onError={(e) => {
						console.error(e);
						setError("Failed to load video");
					}}
					src={nft.alchemyImage.cachedUrl}
					className="aspect-square w-full object-cover"
					autoPlay
					muted
					loop
					playsInline
				/>
			);
		}

		if (!type) {
			return (
				<div className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-muted">
					<div className="text-gray-500">No type</div>
				</div>
			);
		}

		return (
			<div className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-muted">
				<div className="text-gray-500">Type: {type}</div>
			</div>
		);
	}

	const rawImage =
		nft.alchemyRawMetadata?.metadata?.image ||
		nft.alchemyRawMetadata?.metadata?.animation_url;

	if (rawImage?.startsWith("ipfs://")) {
		return (
			<div className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-muted">
				<div className="text-muted-foreground">Native IPFS</div>
				<div className="line-clamp-1 overflow-ellipsis text-muted-foreground text-xs">
					{rawImage}
				</div>
			</div>
		);
	}

	if (rawImage?.startsWith("https://")) {
		return (
			<div className="flex aspect-square w-full items-center justify-center bg-muted">
				<div className="text-muted-foreground">External URL</div>
				<div className="text-muted-foreground text-xs">{rawImage}</div>
			</div>
		);
	}

	if (rawImage) {
		return (
			<div className="flex aspect-square w-full items-center justify-center bg-muted">
				<div className="text-muted-foreground">Other URL</div>
				<div className="overflow-ellipsis text-muted-foreground text-xs">
					{rawImage}
				</div>
			</div>
		);
	}

	if (nft.alchemyRawMetadata?.error) {
		return (
			<div className="flex aspect-square w-full flex-col items-center justify-center bg-muted">
				<div className="text-muted-foreground">Error</div>
				<div className="overflow-ellipsis text-muted-foreground text-xs">
					{nft.alchemyRawMetadata.error}
				</div>
			</div>
		);
	}

	return (
		<div className="flex aspect-square w-full items-center justify-center bg-muted">
			<div className="w-full text-center text-2xs text-muted-foreground">
				tokenURI:{" "}
				<a href={nft.tokenUri} target="_blank" rel="noreferrer">
					{nft.tokenUri}
				</a>
			</div>
		</div>
	);
}
