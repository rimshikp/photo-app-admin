import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChartLine,
  faImage,
  faMoneyBillWave,
  faStar,
  faDownload,
  faHeart,
  faShare,
  faEllipsisVertical,
  faCalendarAlt,
  faEnvelope,
  faPhone,
  faGlobe,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import styles from "./PhotoGraphers.module.css";
import { api } from "../../utils/api";
import Chart from "react-apexcharts";
import defaultImg from "../../assets/profile-icon.png";
// import PhotoDetailPage from "./photo-details/index"
import Gallery from "./gallery/index";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const photographerRes = await api.post(`/users/get-user/${id}`);
        setPhotographer(photographerRes?.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!photographer) {
    return <div className={styles.notFound}>Photographer not found</div>;
  }

  // Calculate totals

  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>
            <h1 className={styles.title}>Photographer Details</h1>
          </div>

          <div className={styles.profileSection}>
            <div className={styles.profileHeader}>
              <div className={styles.profileImageContainer}>
                <img
                  src={photographer.profile || defaultImg}
                  alt={photographer.full_name}
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.profileInfo}>
                <h2>{photographer.full_name}</h2>
                <p className={styles.bio}>
                  {photographer.bio || "No bio available"}
                </p>

                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <FontAwesomeIcon
                      icon={faMoneyBillWave}
                      className={styles.statIcon}
                    />
                    <span>
                      Total Amount Spent:{" "}
                      <strong>
                        ₹{photographer?.totalPurchased.toFixed(2)}
                      </strong>
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <FontAwesomeIcon
                      icon={faImage}
                      className={styles.statIcon}
                    />
                    <span>
                      Images: <strong>{photographer?.totalImages}</strong>
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <FontAwesomeIcon
                      icon={faStar}
                      className={styles.statIcon}
                    />
                    <span>
                      Total Liked: <strong>{photographer?.totalLikedPhoto}</strong>
                    </span>
                  </div>

                  <div className={styles.statItem}>
                    <FontAwesomeIcon
                      icon={faStar} 
                      className={styles.statIcon}
                    />
                    <span>
                      Total Favourites: <strong>{photographer?.totalFavouratePhoto}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>{photographer.email}</span>
              </div>
              <div className={styles.contactItem}>
                <FontAwesomeIcon icon={faPhone} />
                <span>{photographer.phone || "Not provided"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.card}>
          <Gallery userid={id} />
        </div>
      </div>
    </>
  );
}
