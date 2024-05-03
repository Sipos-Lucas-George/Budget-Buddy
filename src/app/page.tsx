"use client";

export default function Home() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-8xl font-bold pb-5 hover:text-custom-green transition duration-300 ease-in-out">
                    Welcome to Budget Buddy!
                </h1>
                <h1 className="text-5xl font-medium hover:text-custom-green transition duration-300 ease-in-out">
                    Streamline your finances with Budget Buddy<br/>
                    <span className="block h-3"></span>
                    your go-to app for effortless expense tracking and budgeting.
                </h1>
            </div>
            <style jsx>{`
                h1 {
                    background-image: url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnd6aHFoZXdmZWVudzZ4ZDJiZXVoc2lhNGtob2JlcmxxZHpyZ3pvYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/isqxY03RuhGxNbCPzY/giphy.gif);
                    background-size: 150%;
                    background-position: 30% 59%;
                    color: transparent;
                    -webkit-background-clip: text;
                    text-transform: uppercase;
                    margin: 10px 0;
                }
            `
            }</style>
        </div>
    );
}
