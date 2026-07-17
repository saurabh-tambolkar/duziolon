import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import {MoveRight } from 'lucide-react'
import Link from 'next/link'

function HomeMain() {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen  px-4 md:pr-24 md:pl-24">
            <div className="flex flex-col justify-center space-y-8 pt-24">
              <h1 className="text-5xl md:text-7xl font-bold">
                The Look You Want. The Price You’ll Love.
              </h1>
              <p className="text-sm text-gray-500">
                Discover a collection designed to bring comfort, confidence, and
                effortless style into your everyday life. Each piece is crafted with
                attention to detail, premium fabrics, and fits that feel as good as
                they look. Whether you're dressing up for a special moment or
                keeping it casual, our styles help you express yourself with ease.
                Step into a wardrobe that moves with you and elevates your everyday.
              </p>
    
    <Link href='/products/mens/all'>
              <Button className="w-1/2 md:w-1/4">Shop Now<MoveRight className="text-white" /></Button>
    </Link>
            </div>
    
            <div className="block gap-4 md:flex md:flex-col md:items-center md:justify-end md:grid md:grid-cols-2 md:gap-4 md:overflow-hidden mb-12 md:mb-0">
              <div className="hidden md:flex md:flex-col justify-baseline items-end  gap-4 overflow-x-scroll w-full">
                <Image
                  src={
                    "https://images.pexels.com/photos/1557843/pexels-photo-1557843.jpeg?_gl=1*27amox*_ga*OTU4MzkzMjUuMTc2MzI5NTM5Ng..*_ga_8JE65Q40S6*czE3NjMyOTUzOTYkbzEkZzEkdDE3NjMyOTcyMzYkajU1JGwwJGgw"
                  }
                  alt="Home image"
                  width={"100"}
                  height={"100"}
                  className="w-1/2 rounded-lg"
                />
                <Image
                  src={
                    "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?_gl=1*tlibva*_ga*OTU4MzkzMjUuMTc2MzI5NTM5Ng..*_ga_8JE65Q40S6*czE3NjMzMDY0MjEkbzIkZzEkdDE3NjMzMDY1ODQkajYwJGwwJGgw"
                  }
                  alt="Home image"
                  width={"100"}
                  height={"100"}
                  className="w-1/2 rounded-lg"
                />
                <Image
                  src={
                    "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?_gl=1*1twalr*_ga*OTU4MzkzMjUuMTc2MzI5NTM5Ng..*_ga_8JE65Q40S6*czE3NjMyOTUzOTYkbzEkZzEkdDE3NjMyOTcyMzYkajU1JGwwJGgw"
                  }
                  alt="Home image"
                  width={"100"}
                  height={"100"}
                  className="w-1/2 rounded-lg"
                />
              </div>
              <div className="flex mt-12 md:mt-0 flex-row md:flex-col justify-center items-start gap-4 md:-mt-50 overflow-x-scroll w-full">
                <Image
                  src={
                    "https://images.pexels.com/photos/965324/pexels-photo-965324.jpeg?_gl=1*th4lve*_ga*OTU4MzkzMjUuMTc2MzI5NTM5Ng..*_ga_8JE65Q40S6*czE3NjMzMDY0MjEkbzIkZzEkdDE3NjMzMDY1ODQkajYwJGwwJGgw"
                  }
                  alt="Home image"
                  width={"100"}
                  height={"100"}
                  className="w-1/2 rounded-lg"
                />
                <Image
                  src={
                    "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?_gl=1*1p452hn*_ga*OTU4MzkzMjUuMTc2MzI5NTM5Ng..*_ga_8JE65Q40S6*czE3NjMzMDY0MjEkbzIkZzEkdDE3NjMzMDY1ODQkajYwJGwwJGgw"
                  }
                  alt="Home image"
                  width={"100"}
                  height={"100"}
                  className="w-1/2 rounded-lg"
                />
                <Image
                  src={
                    "https://images.pexels.com/photos/449977/pexels-photo-449977.jpeg?_gl=1*bba09p*_ga*OTU4MzkzMjUuMTc2MzI5NTM5Ng..*_ga_8JE65Q40S6*czE3NjMyOTUzOTYkbzEkZzEkdDE3NjMyOTU2ODUkajEyJGwwJGgw"
                  }
                  alt="Home image"
                  width={"100"}
                  height={"100"}
                  className="w-1/2 rounded-lg"
                />
                <Image
                  src={
                    "https://images.pexels.com/photos/965324/pexels-photo-965324.jpeg?_gl=1*th4lve*_ga*OTU4MzkzMjUuMTc2MzI5NTM5Ng..*_ga_8JE65Q40S6*czE3NjMzMDY0MjEkbzIkZzEkdDE3NjMzMDY1ODQkajYwJGwwJGgw"
                  }
                  alt="Home image"
                  width={"100"}
                  height={"100"}
                  className="w-1/2 rounded-lg"
                />
              </div>
            </div>
          </div>
  )
}

export default HomeMain