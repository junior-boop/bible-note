import { useCallback, useEffect, useState } from "react";
import Title from "../../communs/ui/title";
import Subtitle from "../../communs/ui/subtitle";
import type { User } from "../../lib/database/db";

export default function Settings() {
    const [userState, setUserState] = useState<User | null>(null);


    const user = useCallback(async () => {
        const usersession = window.api.db.getsessionid()
        const userJson = JSON.parse(usersession) as { id: string, email: string, name: string }

        const userinfos = await window.api.db.getuserinfos(userJson.id)
        setUserState(userinfos)

        console.log(userinfos)
    }, [userState])

    useEffect(() => {
        user()
    }, [])
    return (
        <div className="w-full h-dvh">

            <div className="py-4 overflow-y-scroll h-dvh pl-8 pr-3">
                <Title title="Paramètres" />
                <div>
                    La liste des notes sera affichée ici.
                </div>
                <div className="mt-6 w-[70%] ">
                    <div className="mb-6 p-4 bg-fuchsia-100">
                        <Subtitle className="text-fuchsia-800" title="Don et Sponsoring" />
                        <div className="text-gray-600 dark:text-gray-300 mt-2 space-y-3">
                            <p>Votre soutien est précieux ! Pour nous aider à maintenir l'application et à développer de nouvelles fonctionnalités passionnantes, pensez à faire un don.</p>
                            <p>Chaque contribution, petite ou grande, fait une réelle différence et nous permet de continuer à améliorer votre expérience. Merci pour votre générosité !</p>

                        </div>
                    </div>
                    <div className="mb-6">
                        <Subtitle title="Change de Theme de coleur" />
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div>Theme Sombre</div>
                                <div className="text-gray-700">
                                    <input type="radio" name="theme" id="" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>Theme Claire</div>
                                <div className="text-gray-700"><input type="radio" name="theme" id="" /></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>Theme Systeme</div>
                                <div className="text-gray-700"><input type="radio" name="theme" id="" /></div>
                            </div>

                        </div>
                    </div>
                    <div className="mb-6">
                        <Subtitle title="Les Notification" />
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div>Les articles recommandés</div>
                                <div className="text-gray-700"><input type="checkbox" name="notifs" id="" /></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>Les témoignages</div>
                                <div className="text-gray-700"><input type="checkbox" name="notifs" id="" /></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>Lorsqu'une personne index votre profils ou vous suit</div>
                                <div className="text-gray-700"><input type="checkbox" name="notifs" id="" /></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>Lorsqu'on vous mensionne</div>
                                <div className="text-gray-700"><input type="checkbox" name="notifs" id="" /></div>
                            </div>

                        </div>
                    </div>
                    <div className="mb-6">
                        <Subtitle title="Sauvegarde et Synchronisation" />
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div>sauvegarde automatique en ligne</div>
                                <div className="text-gray-700"><input type="checkbox" name="save" id="" /></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>Synchronisation avec votre version mobile</div>
                                <div className="text-gray-700"><input type="checkbox" name="save" id="" /></div>
                            </div>

                        </div>
                    </div>
                    <div className="mb-6">
                        <Subtitle title="Compte" />
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div>Email</div>
                                <div className="text-gray-700">{userState?.email}</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>Nom complet de l'utilisateur</div>
                                <div className="text-gray-700">{userState?.name}</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>Deconnexion</div>
                                <button className="px-4 py-2 rounded-xl bg-red-500 text-white">
                                    Se Déconnecter
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



