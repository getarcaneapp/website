// SPDX SBOM Types

export interface SpdxDocument {
	SPDXID: string;
	spdxVersion: string;
	name: string;
	dataLicense: string;
	documentNamespace: string;
	creationInfo: SpdxCreationInfo;
	packages: SpdxPackage[];
	files?: SpdxFile[];
	relationships?: SpdxRelationship[];
	hasExtractedLicensingInfos?: SpdxExtractedLicensingInfo[];
}

export interface SpdxCreationInfo {
	created: string;
	creators: string[];
	licenseListVersion?: string;
}

export interface SpdxPackage {
	SPDXID: string;
	name: string;
	versionInfo?: string;
	supplier?: string;
	originator?: string;
	downloadLocation: string;
	filesAnalyzed?: boolean;
	packageVerificationCode?: {
		packageVerificationCodeValue: string;
	};
	sourceInfo?: string;
	licenseConcluded?: string;
	licenseDeclared?: string;
	copyrightText?: string;
	externalRefs?: SpdxExternalRef[];
}

export interface SpdxExternalRef {
	referenceCategory: string;
	referenceType: string;
	referenceLocator: string;
}

export interface SpdxFile {
	SPDXID: string;
	fileName: string;
	checksums?: SpdxChecksum[];
}

export interface SpdxChecksum {
	algorithm: string;
	checksumValue: string;
}

export interface SpdxRelationship {
	spdxElementId: string;
	relatedSpdxElement: string;
	relationshipType: string;
	comment?: string;
}

export interface SpdxExtractedLicensingInfo {
	licenseId: string;
	extractedText: string;
	name?: string;
}

// Metadata for SBOM display
export interface SbomMetadata {
	version: string;
	updated: string;
	images: {
		manager: SbomImageInfo;
		agent: SbomImageInfo;
	};
}

export interface SbomImageInfo {
	name: string;
	architectures: string[];
	sbomFiles: {
		amd64: string;
		arm64: string;
	};
}

// Simplified package for display
export interface DisplayPackage {
	name: string;
	version: string;
	type: 'deb' | 'go-module' | 'other';
	license: string;
	purl?: string;
}

export function parsePackageType(pkg: SpdxPackage): 'deb' | 'go-module' | 'other' {
	const purl = pkg.externalRefs?.find((ref) => ref.referenceType === 'purl')?.referenceLocator;

	if (purl?.startsWith('pkg:deb/')) return 'deb';
	if (purl?.startsWith('pkg:golang/')) return 'go-module';
	if (pkg.SPDXID.includes('-deb-')) return 'deb';
	if (pkg.SPDXID.includes('-go-module-')) return 'go-module';

	return 'other';
}

export function extractDisplayPackages(sbom: SpdxDocument): DisplayPackage[] {
	return sbom.packages
		.filter((pkg) => pkg.name && pkg.versionInfo)
		.map((pkg) => {
			const purl = pkg.externalRefs?.find((ref) => ref.referenceType === 'purl')?.referenceLocator;

			return {
				name: pkg.name,
				version: pkg.versionInfo || 'unknown',
				type: parsePackageType(pkg),
				license: pkg.licenseDeclared || pkg.licenseConcluded || 'NOASSERTION',
				purl
			};
		})
		.sort((a, b) => {
			// Sort by type first, then by name
			if (a.type !== b.type) {
				const typeOrder = { 'go-module': 0, deb: 1, other: 2 };
				return typeOrder[a.type] - typeOrder[b.type];
			}
			return a.name.localeCompare(b.name);
		});
}
