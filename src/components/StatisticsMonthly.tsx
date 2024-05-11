import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Card, CardContent} from "@/components/ui/card";
import StatisticsPayment from "@/components/StatisticsPayment";
import StatisticsType from "@/components/StatisticsType";
import StatisticsCategory from "@/components/StatisticsCategory";

type StatisticsMonthlyProps = {
    statistics: any[];
};

function StatisticsMonthly({statistics}: StatisticsMonthlyProps) {
    return (
        <div className="flex flex-grow items-center justify-center pt-10 pb-5 h-full">
            <Carousel className="w-10/12 h-full">
                <CarouselContent  className="h-full">
                    <CarouselItem key={1} className="h-full">
                        <div className="p-1 h-full">
                            <Card className="h-full">
                                <CardContent className="flex items-center justify-center flex-col p-6 h-full">
                                    <StatisticsType  dataType={statistics[0]}/>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                    <CarouselItem key={2} className="h-full">
                        <div className="p-1 h-full">
                            <Card className="h-full">
                                <CardContent className="flex items-center justify-center flex-col p-6 h-full">
                                    <StatisticsPayment dataPayment={statistics[1]}/>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                    <CarouselItem key={3} className="h-full">
                        <div className="p-1 h-full">
                            <Card className="h-full">
                                <CardContent className="flex items-center justify-center flex-col p-6 h-full">
                                    <StatisticsCategory dataCategory={statistics[2]}/>
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