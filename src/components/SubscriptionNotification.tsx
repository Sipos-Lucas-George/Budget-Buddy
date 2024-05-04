import {CardActions, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Card, CardContent} from "@/components/ui/card";
import {EnumSubscriptionType} from "@prisma/client";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {userSettings} from "@/utils/user_settings";

type SubscriptionsProps = {
    id: string;
    name: string;
    renews: Date;
    type: EnumSubscriptionType;
    amount: number;
}

type SubscriptionNotificationProps = {
    subscriptions: SubscriptionsProps[];
    setSubscriptions: Function;
    paySubscription: Function;
    skipSubscription: Function;
}

function SubscriptionNotification(
    {subscriptions, setSubscriptions, paySubscription, skipSubscription}: SubscriptionNotificationProps) {
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.2)",
            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10
        }}>
            <div style={{
                width: 450, minWidth: 200, background: "white", padding: 20, borderRadius: 5,
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column",
            }}>
                <IconButton size="small" className="self-end"
                            onClick={() => setSubscriptions([])}
                            sx={{background: "#00CF8D77", borderRadius: 2}}>
                    <CloseIcon sx={{fill: "#f8f8f8"}}/>
                </IconButton>
                <div className="flex justify-center pt-5">
                    <Carousel className="w-9/12">
                        <CarouselContent>
                            {subscriptions.map((subscription, index) => (
                                <CarouselItem key={subscription.id}>
                                    <div className="p-1">
                                        <Card>
                                            <CardContent
                                                className="flex aspect-square items-center justify-center flex-col p-6">
                                                <div className="text-3xl font-semibold pb-3">{subscription.name}</div>
                                                <div className="text-2xl font-normal pb-3">{subscription.type}</div>
                                                <div
                                                    className="text-2xl font-normal text-custom-green">{userSettings.currency}{subscription.amount.toFixed(2)}</div>
                                            </CardContent>
                                            <CardActions className="flex justify-evenly">
                                                <Button className="flex-1" startIcon={<AddIcon/>}
                                                        onClick={() => paySubscription(subscription, index)}>
                                                    Pay
                                                </Button>
                                                <Button className="flex-1" sx={{color: "red"}}
                                                        startIcon={<DeleteIcon sx={{fill: "red"}}/>}
                                                        onClick={() => skipSubscription(subscription, index)}>
                                                    Skip
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious/>
                        <CarouselNext/>
                    </Carousel>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionNotification;