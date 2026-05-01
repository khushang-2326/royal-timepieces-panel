import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-watch.jpg";
import watch2 from "@/assets/watch-2.jpg";
import { Award, Clock, Shield, Users } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-in fade-in zoom-in duration-1000"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-4 animate-in fade-in duration-1000 delay-300">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 text-white">
            Our <span className="text-silver">Legacy</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto font-light">
            Defining excellence in horology since 1995.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 animate-in slide-in-from-left duration-700">
            <div className="relative rounded-lg overflow-hidden shadow-2xl border border-white/10">
              <img
                src={watch2}
                alt="Watch Craftsmanship"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6 animate-in slide-in-from-right duration-700 delay-200">
            <h2 className="font-playfair text-4xl font-bold gold-gradient-text">The Royal Standard</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Royal Timepieces, we believe that a watch is more than just a device to tell time—it is a statement of character, a piece of history, and a work of art.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Founded with a passion for Swiss engineering and timeless aesthetics, we have curated a collection that represents the pinnacle of luxury. Every timepiece in our inventory is hand-selected, verified for authenticity, and serviced to ensure it meets our exacting standards.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => navigate("/collections")}
                className="bg-silver text-black hover:bg-silver-light font-semibold px-8 py-6 text-lg"
              >
                View Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/20 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are dedicated to providing an unparalleled experience for every collector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Authenticity Guaranteed",
                desc: "Every watch is rigorously inspected by our expert watchmakers."
              },
              {
                icon: Clock,
                title: "Timeless Service",
                desc: "Lifetime support and servicing for all our valued clients."
              },
              {
                icon: Shield,
                title: "Secure Warranty",
                desc: "Comprehensive warranty coverage on every timepiece sold."
              },
              {
                icon: Users,
                title: "Expert Consultation",
                desc: "Personalized advice to help you find your perfect match."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-xl text-center hover:bg-white/5 transition-colors duration-300 group"
              >
                <div className="w-16 h-16 bg-silver/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-silver/20 transition-colors">
                  <item.icon className="w-8 h-8 text-silver" />
                </div>
                <h3 className="font-playfair text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
          <div className="p-4">
            <div className="text-4xl md:text-5xl font-playfair font-bold text-silver mb-2">25+</div>
            <div className="text-muted-foreground">Years of Experience</div>
          </div>
          <div className="p-4">
            <div className="text-4xl md:text-5xl font-playfair font-bold text-silver mb-2">10k+</div>
            <div className="text-muted-foreground">Watches Sold</div>
          </div>
          <div className="p-4">
            <div className="text-4xl md:text-5xl font-playfair font-bold text-silver mb-2">100%</div>
            <div className="text-muted-foreground">Authenticity Rate</div>
          </div>
          <div className="p-4">
            <div className="text-4xl md:text-5xl font-playfair font-bold text-silver mb-2">4.9</div>
            <div className="text-muted-foreground">Customer Rating</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
