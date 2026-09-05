import type { ComplaintStatus } from "../../../generated/prisma/enums";

export interface ICreateComplaint {
	title: string;
	description: string;
}

export interface IUpdateComplaint {
	title?: string;
	description?: string;
	status?: ComplaintStatus;
}
