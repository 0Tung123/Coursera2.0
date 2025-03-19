import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [courses, setCourses] = useState([]);

  return (
    <div className="container">
      <Head>
        <title>Coursera Project</title>
        <meta name="description" content="Personal Coursera Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Personal Coursera</h1>
        <p>
          A full-stack application built with TypeScript, Next.js, NestJS,
          PostgreSQL, and Docker.
        </p>

        <div className="courses-container">
          {courses.length > 0 ? (
            <div className="courses-grid">
              {courses.map((course: any) => (
                <div key={course.id} className="course-card">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No courses available yet.</p>
          )}
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .courses-container {
          margin-top: 2rem;
          width: 100%;
          max-width: 800px;
        }
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        .course-card {
          border: 1px solid #eaeaea;
          border-radius: 10px;
          padding: 1.5rem;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .course-card:hover,
        .course-card:focus,
        .course-card:active {
          color: #0070f3;
          border-color: #0070f3;
        }
      `}</style>
    </div>
  );
}
