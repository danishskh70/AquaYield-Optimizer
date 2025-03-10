import Card from "react-bootstrap/Card";
import { FaLinkedin, FaGithub } from "react-icons/fa"; // Import icons
import '../styles/About.css'

const About = () => {
  // Array of card data
  const card1 = [

    {
        image: "public/Profile/Navnath Jadhav.jpg",
        title: "Navnath Narayan Jadhav",
        subtitle: " navnathjadhav0824@gmail.com ",
        text: "Full Stack Developer",
        links: [
          { url: "https://www.linkedin.com/in/navnath-jadhav-", label: "LinkedIn", icon: <FaLinkedin /> },
          { url: "#link8", label: "GitHub", icon: <FaGithub /> },
        ],
      },
    {
      image: "public/Profile/Vivek Bhosale.jpg",
      title: "Vivek Shankar Bhosale",
      subtitle: "bhosalevivek04@gmail.com",
      text: "Backend Developer ",
      links: [
        { url: "https://www.linkedin.com/in/vivekbhosale04", label: "LinkedIn", icon: <FaLinkedin /> },
        { url: "https://github.com/bhosalevivek04", label: "GitHub", icon: <FaGithub /> },
      ],
    },
    {
      image: "public/Profile/Suyash Mungase.jpg",
      title: "Suyash Shankar Mungase",
      subtitle: "ssmsuyash@gmail.com",
      text: "Frontend Developer ",
      links: [
        { url: "https://www.linkedin.com/in/suyash-mungase-863791255", label: "LinkedIn", icon: <FaLinkedin /> },
        { url: "https://github.com/suyash1702", label: "GitHub", icon: <FaGithub /> },
      ],
    },
    {
      image: "public/Profile/Danish Shaikh.png",
      title: "Danishalam Daut Shaikh",
      subtitle: "danishskh70@gmail.com",
      text: "Backend Developer",
      links: [
        { url: "https://www.linkedin.com/in/danish-shaikh-262016265/", label: "LinkedIn", icon: <FaLinkedin /> },
        { url: "https://github.com/danishskh70/", label: "GitHub", icon: <FaGithub /> },
      ],
    },
    
    {
        image: "public/Profile/tejas.jpg",
        title: "Tejas Sunil Nirmal",
        subtitle: "tejasnirmal252@gmail.com",
        text: "Full Stack Developer",
        links: [
          { url: "https://www.linkedin.com/in/tejas-nirmal-89862b291/", label: "LinkedIn", icon: <FaLinkedin /> },
          { url: "https://github.com/TejasNirmal29", label: "GitHub", icon: <FaGithub /> },
        ],
      },
  ];

  return (
    <div className="text-center">
      {/* card1 Section */}
      <div
        className="container"
        style={{
          paddingTop: "0.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "5.2rem",
          justifyContent: "center",
          paddingLeft: "2rem",
          height: "100%",
          width: "100%",
          marginLeft: "50px",
          marginTop: "0.1rem",
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        {card1.map((card, index) => (
          <Card
            key={index}
            className="h-150 d-flex flex-row align-items-center"
            style={{
              height: "206px",
              width: "100%",
              maxWidth: "500px",
              padding: "1rem",
            }}
          >
            {/* Image Section */}
            <div
              style={{
                width: "150px",
                height: "170px",
                overflow: "hidden",
                marginRight: "1rem",
              }}
            >
              <Card.Img
                src={card.image}
                alt={`Card image ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <Card.Body className="d-flex flex-column justify-content-center">
              <Card.Title>{card.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{card.subtitle}</Card.Subtitle>
              <Card.Text>{card.text}</Card.Text>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                {card.links.map((link, linkIndex) => (
                  <Card.Link
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "1rem" }}
                  >
                    {link.icon} {link.label}
                  </Card.Link>
                ))}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default About;