
@php

    $info = $common_content['info'] ;
    $socials = $common_content['socials'] ;

    $social_true = (!$socials) ? false : true ;
    $info_true = (!$info) ? false : true ;

    if($info_true){

        $web_title = $info['web_title'] ;
        $head_mail = $info['email'] ;
        $head_fone = "+91-".$info['mobile_no'] ;
        $logo = "assets/ecomm/logos/".$info['logo'] ;
        $address = $info['address'] ;

    }else{
        $web_title = '' ;
        $head_mail = 'example@gamil.com' ;
        $head_fone = "+91-9876543210";
        $logo =  'assets/ecomm/logos/no_logo.png';
        $address =  '23/4 Bhopal MP 404133 ';

    }

@endphp

<div class="container-fluid bg-secondary text-dark pt-0"> 
    <div class="row px-xl-5 pt-5">

        <div class="col-lg-3 col-md-12 mb-5 pr-3 pr-xl-5">

            <a href="{{$ecommbaseurl}}" class="text-decoration-none d-block">
                    <img src="{{ asset($logo)}}" class="img-responsive logo_image footer-logo" width="160" height="60" alt="{{ $web_title ?? 'Logo' }}" loading="lazy">
            </a>

        </div>

        <div class="col-lg-6 col-md-12">

            <div class="row">

                <div class="col-md-6 mb-5 col-6">
                    <h5 class="font-weight-bold text-dark mb-4">Quick Links</h5>
                    <div class="d-flex flex-column justify-content-start">
                        <a class="text-white mb-2" href="{{ url("{$ecommbaseurl}") }}"><i
                                class="fa fa-angle-right mr-2"></i>Home</a>
                        <a class="text-white mb-2" href="{{ url("{$ecommbaseurl}about") }}"><i
                                class="fa fa-angle-right mr-2"></i>About</a>
                        <a class="text-white mb-2" href="{{ url("{$ecommbaseurl}shop") }}"><i
                                class="fa fa-angle-right mr-2"></i>Shop</a>
						<a class="text-white mb-2" href="{{ url("{$ecommbaseurl}scheme") }}"><i
                                class="fa fa-angle-right mr-2"></i>Scheme</a>
                        <a class="text-white" href="{{ url("{$ecommbaseurl}contact") }}"><i
                                class="fa fa-angle-right mr-2"></i>Contact</a>
                    </div>
                </div>

                <div class="col-md-6 mb-5 col-6">
                    <h5 class="font-weight-bold text-dark mb-4">Important Links</h5>
                    <div class="d-flex flex-column justify-content-start">
                        <a class="text-white mb-2" href="{{ url("{$ecommbaseurl}terms-conditions") }}"><i
                                class="fa fa-angle-right mr-2"></i>Terms &
                            Condition</a>
                        <a class="text-white mb-2" href="{{ url("{$ecommbaseurl}privacy-policy") }}"><i
                                class="fa fa-angle-right mr-2"></i>Privacy
                            Policies</a>
							
                        <a class="text-white mb-2" href="{{ url("{$ecommbaseurl}refund-policy") }}"><i
                                class="fa fa-angle-right mr-2"></i>Refund
                            Policies</a>
                        <a class="text-white mb-2" href="{{ url("{$ecommbaseurl}shiping-policy") }}"><i
                                class="fa fa-angle-right mr-2"></i>Shiping
                            Policies</a>
                        <a class="text-white mb-2" href="{{ url("{$ecommbaseurl}desclaimer") }}"><i
                            class="fa fa-angle-right mr-2"></i>Disclaimer</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-12 mb-5 pr-3 pr-xl-5 footer_info_sec">
            <a href="" class="text-decoration-none">
                <h5 class="mb-4 font-weight-bold text-dark mb-4">Get InTouch</h1>
            </a>
            <p class="mb-2 d-flex">
			<i class="fa fa-map-marker-alt text-primary mr-3"></i>
			<a href="https://maps.app.goo.gl/1CPFdxvgGEVYoh8J6" class="text-white" target="_blank">
			{!!  $address !!}
			</a>
			</p>
            <p class="mb-2 d-flex"><i class="fa fa-envelope text-primary mr-3"></i>               
            <a href="mailto:{{ $head_mail }}" target="_blank" class="text-white">{{ $head_mail }}</a></p>
            {{--<p class="mb-0 d-flex"><i class="fa fa-phone-alt text-primary mr-3"></i>
			<a href="https://wa.me/{{ $head_fone }}" class="text-white" target="_blank"> 
			{{ $head_fone }}
			</a></p>--}}
                <p class="mb-0 d-flex">
                    <i class="fa fa-phone-alt text-primary mr-3"></i>
                    <a  class="text-white" target="_blank" href="tel:{{ @$head_fone }}">
                        {{ $head_fone }}
                    </a>
                </p>

        </div>
    </div>

    <div class="row border-top border-light mx-xl-5 py-4">
        <div class="col-md-6 px-xl-0">
            <p class="mb-md-0 text-center text-md-left text-dark">
               Copy Rights &copy; <a class="text-dark font-weight-semi-bold" href="#"> <u>{{$web_title}}</u> </a> | All Rights Reserved |  Developed By <a class="text-dark font-weight-semi-bold" href = "https://www.hambiresolutions.com/" target="_blank" > <u>Hambire Solutions</u> </a>
            </p>
        </div>

        <div class="col-md-6 px-xl-0 text-center text-md-right">
            <img class="img-fluid" src = "{{ asset('assets/ecomm/img/payments.png') }}" alt="Payments" width="280" height="30" loading="lazy">
        </div>

    </div>
</div>

<!-- Footer End -->

<div class="today_rate_block" style="color: black; ">
    <a href="#my_rate_block" class="btn btn-outline-primary form-control d-none d-lg-block d-md-block" onclick="event.preventDefault();$($(this).attr('href')).toggle('slide');"><i class="fa fa-angle-down"></i> Todays rate</a>
     <a href="#my_rate_block" class="btn btn-outline-primary form-control d-lg-none d-md-none d-block" onclick="$($(this).attr('href')).toggle('slide');"><i class="fa fa-angle-down"></i> Rate</a>
    <ul id="my_rate_block" style="display:none; background-color: white; border-radius: 10px; margin-top: 2px;">
        <li class="px-2"><h6>GOLD <small>(10Gm)</small></h6><hr class="mb-1 mt-1"></li>
		<li class="px-2"><b>24K</b> : <span id="rate_gold_24k">-</span></li>
        <li class="px-2"><b>22K</b> : <span id="rate_gold_22k">-</span></li>
        <li class="px-2"><b>20K</b> : <span id="rate_gold_20k">-</span></li>
        <li class="px-2"><b>18K</b> : <span id="rate_gold_18k">-</span></li>
        <li class="px-2 pt-2"><h6>SILVER</h6><hr class="mb-1 mt-1"></li>
		<li class="px-2"><b>1Kg</b> : <span id="rate_silver_1kg">-</span></li>
        <li class="px-2"><b>10Gm</b> : <span id="rate_silver_10g">-</span></li>
		<li class="px-2"><b>1Gm</b> : <span id="rate_silver_1g">-</span></li>
		<li class="text-center" style="color:rgb(12, 12, 12);"><hr class="m-0 p-0"><small ><b>Update : </b><i id="rate_update">--/--/----</i></small></li>

    </ul>
</div>

 <!-- Help Widget -->
<div id="help-widget">
  <div class="help-icon">
    <i class="fas fa-headset"></i> <!-- Font Awesome icon -->
  </div>
  <div class="help-options">
    <a  target="_blank"  id="whatsapp_out">
       <i class="fab fa-whatsapp" style="color:#25D366;"></i> WhatsApp
    </a>
    <a href="tel:{{ @$head_fone }}">
      <i class="fas fa-phone-alt" style="color:#34B7F1;"></i> Call
    </a>
<a href="mailto:{{ @$head_mail }}?subject=Inquiry&body=Hello, I want more details.">
  <i class="fas fa-envelope" style="color:#EA4335;"></i> Email
</a>

  </div>
</div>

<!-- Font Awesome Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">


@include('msgpopup')
<!-- Back to Top -->

<a href="#" class="btn btn-primary back-to-top"><i class="fa fa-angle-double-up"></i></a>
