import React from "react";

const MyFooter = () => (
    <footer style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} className='text-center text-lg-start text-muted'>
      <section className='border-bottom'>
        <div className='container text-center text-md-start mt-5'>
         
          <div className='row mt-3'>
            <div className='col-md-3 col-lg-4 col-xl-3 mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <i className='fas fa-gem me-3'></i>Lorem Ipsum
              </h6>
              <p>
              Lorem Ipsum
              </p>
            </div>

            <div className='col-md-2 col-lg-2 col-xl-2 mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Lorem Ipsum</h6>
              <p>
                <a href='http://localhost:3000' className='text-reset'>
                  Lorem Ipsum
                </a>
              </p>
              <p>
                <a href='http://localhost:3000' className='text-reset'>
                  Lorem Ipsum
                </a>
              </p>
              <p>
                <a href='http://localhost:3000' className='text-reset'>
                  Lorem Ipsum
                </a>
              </p>
              <p>
                <a href='http://localhost:3000' className='text-reset'>
                  Lorem Ipsum
                </a>
              </p>
            </div>
            <div className='col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Lorem Ipsum</h6>
              <p>
                <i className='fas fa-envelope me-3'></i>
                Lorem Ipsum
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className='text-center p-4 bg-dark text-white' >
        © 2022 Copyright: 
        <a className='text-reset fw-bold text-white' href='http://localhost:3000'>
          Lorem Ipsum
        </a>
      </div>
    </footer>
);

export default MyFooter;
