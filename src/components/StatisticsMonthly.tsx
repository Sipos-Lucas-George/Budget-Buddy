import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Card, CardContent} from "@/components/ui/card";
import Example from "@/components/Example";

type StatisticsMonthlyProps = {}

function StatisticsMonthly() {
    return (
        <div className="flex flex-grow items-center justify-center pt-10 pb-5 h-full">
            <Carousel className="w-10/12 h-full">
                <CarouselContent  className="h-full">
                    <CarouselItem key={1} className="h-full">
                        <div className="p-1 h-full">
                            <Card className="h-full">
                                <CardContent className="flex items-center justify-center flex-col p-6 h-full">
                                    <Example/>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                    <CarouselItem key={2} className="h-full">
                        <div className="p-1 h-full">
                            <Card className="h-full">
                                <CardContent className="flex items-center justify-center flex-col p-6 h-full">
                                    2
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                    <CarouselItem key={3} className="h-full">
                        <div className="p-1 h-full">
                            <Card className="h-full">
                                <CardContent className="flex items-center justify-center flex-col p-6 h-full">
                                    3
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="hover:bg-custom-green-hover"/>
                <CarouselNext className="hover:bg-custom-green-hover"/>
            </Carousel>
        </div>
    );
}

export default StatisticsMonthly;