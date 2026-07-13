import { getUserRole } from "~/lib/api/authz.server";
import { requireRequestUser } from "~/lib/supabase/auth.server";

export async function loader({ request }: { request: Request }) {
    const { user, responseHeaders } = await requireRequestUser(request);
    const role = await getUserRole(user.id);

    return new Response(
        JSON.stringify({
            user: {
                id: user.id,
                email: user.email,
                role,
            },
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...Object.fromEntries(responseHeaders.entries()),
            },
        }
    );
}