import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return Response.json(null, { status: 401 });
    }

    try {
        const user = jwtDecode(accessToken);
        return Response.json(user);
    } catch {
        return Response.json(null, { status: 401 });
    }
}
