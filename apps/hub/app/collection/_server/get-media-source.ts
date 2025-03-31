import type { ExtendedNft } from "@/app/collection/_server/get-nfts";
import type { NFT } from "@/db/schemas/nfts";
import { Ok } from "@repo/shared/result/ok";
import type { Result } from "@repo/shared/result/try";

function parseAlchemyContentType(contentType: string): MediaSource["type"] {
	const [type, format] = contentType.split("/");
	return `${type}/${format}` as MediaSource["type"];
}

export async function getMediaSource(
	nft: ExtendedNft | NFT,
): Promise<Result<MediaSource>> {
	if (nft.alchemyImage?.cachedUrl) {
		const type = nft.alchemyImage.contentType;
		return Ok({
			source: "alchemy",
			type: "image",
			url: nft.alchemyImage.cachedUrl,
		});
	}
}
