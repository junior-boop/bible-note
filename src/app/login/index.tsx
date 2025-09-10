import { useCallback, useEffect } from "react";
import { User, UserInput } from "../../lib/database/db";
import { useGlobalContext } from "../../communs/context/global";

export default function MainLogin() {
    const { USER } = useGlobalContext()
    const [infos, setter] = USER
    const sender = useCallback(async (data: UserInput) => {
        const response = await window.api.external.setExternalData({
            name: data.name,
            email: data.email,
            lastlogin: data.lastlogin,
            lastlogout: data.lastlogout,
        });

        const setusersession = await window.api.db.setsession({
            ...response as User
        });
        window.api.db.addsessionid(JSON.stringify({
            id: setusersession?.iduser,
            name: setusersession?.name,
            email: setusersession?.email,
        }))
        setter(setusersession)
    }, [setter]);




    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = e.target as HTMLFormElement;
        const data: UserInput = {
            name: formData.name?.value as string,
            email: formData.email?.value as string,
            lastlogin: "",
            lastlogout: "",
        };
        sender(data);
    };

    useEffect(() => {
        console.log(infos)
    }, [infos]);

    return (
        <div className="flex items-center justify-center h-screen">
            <form className="w-[300px] space-y-2" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Nom complet:</label>
                    <input type="text" id="name" className="border-slate-200 border px-3 py-2 rounded-lg w-full" required />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" className="border-slate-200 border px-3 py-2 rounded-lg w-full" required />
                </div>
                <div className="flex gap-2 items-start">
                    <div>
                        <input type="checkbox" id="terms" className="mt-1" required />
                    </div>
                    <div>
                        <label htmlFor="terms" className="text-sm">J'ai lu et j'accepte les termes et conditions d'utilisation.</label>
                    </div>
                </div>
                <div className="pt-2">
                    <button className="px-6 py-2 rounded-2 bg-blue-500 text-white w-full flex items-center justify-center rounded-lg">Connexion</button>
                </div>
            </form>
        </div>
    );
}