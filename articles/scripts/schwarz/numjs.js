var nj = new Object();

nj.Cmplx = function(re, im) {
	this.re = re;
	this.im = im;
};

nj.C = function(re, im) {
	return new nj.Cmplx(re, im);
};

nj.P = function(abs, arg) {
	var re = abs * Math.cos(arg);
	var im = abs * Math.sin(arg);
	return new nj.Cmplx(re, im);
};

nj.Cmplx.prototype =
{
	op_add: function(a, b) {
		if ((a instanceof nj.Cmplx) && (b instanceof nj.Cmplx))
			return nj.C(a.re + b.re, a.im + b.im);
		if ((a instanceof nj.Cmplx) && (typeof(b) == "number"))
			return nj.C(a.re + b, a.im);
		if ((typeof(a) == "number") && (b instanceof nj.Cmplx))
			return nj.C(a + b.re, b.im);
		if (!(b instanceof nj.Cmplx) && (typeof(b.op_add) == "function"))
			return b.op_add(a, b);
		throw "nj.Cmplx type error";
	},
	op_sub: function(a, b) {
		if ((a instanceof nj.Cmplx) && (b instanceof nj.Cmplx))
			return nj.C(a.re - b.re, a.im - b.im);
		if ((a instanceof nj.Cmplx) && (typeof(b) == "number"))
			return nj.C(a.re - b, a.im);
		if ((typeof(a) == "number") && (b instanceof nj.Cmplx))
			return nj.C(a - b.re, -b.im);
		if (!(b instanceof nj.Cmplx) && (typeof(b.op_sub) == "function"))
			return b.op_sub(a, b);
		throw "nj.Cmplx type error";
	},
	op_mul: function(a, b) {
		if ((a instanceof nj.Cmplx) && (b instanceof nj.Cmplx))
			return nj.C(a.re*b.re - a.im*b.im, a.re*b.im + a.im*b.re);
		if ((a instanceof nj.Cmplx) && (typeof(b) == "number"))
			return nj.C(a.re * b, a.im * b);
		if ((typeof(a) == "number") && (b instanceof nj.Cmplx))
			return nj.C(a * b.re, a * b.im);
		if (!(b instanceof nj.Cmplx) && (typeof(b.op_mul) == "function"))
			return b.op_mul(a, b);
		throw "nj.Cmplx type error";
	},
	op_dot: function(a, b) {
		if ((a instanceof nj.Cmplx) && (b instanceof nj.Cmplx))
			return nj.C(a.re*b.re - a.im*b.im, a.re*b.im + a.im*b.re);
		if ((a instanceof nj.Cmplx) && (typeof(b) == "number"))
			return nj.C(a.re * b, a.im * b);
		if ((typeof(a) == "number") && (b instanceof nj.Cmplx))
			return nj.C(a * b.re, a * b.im);
		if (!(b instanceof nj.Cmplx) && (typeof(b.op_dot) == "function"))
			return b.op_dot(a, b);
		throw "nj.Cmplx type error";
	},
	op_div: function(a, b) {
		if ((a instanceof nj.Cmplx) && (b instanceof nj.Cmplx))
			return nj.C((a.re*b.re + a.im*b.im) / (b.re*b.re + b.im*b.im),
					(a.im*b.re - a.re*b.im) / (b.re*b.re + b.im*b.im));
		if ((a instanceof nj.Cmplx) && (typeof(b) == "number"))
			return nj.C(a.re / b, a.im / b);
		if ((typeof(a) == "number") && (b instanceof nj.Cmplx))
			return nj.C((a*b.re) / (b.re*b.re + b.im*b.im), (-a*b.im) / (b.re*b.re + b.im*b.im));
		if (!(b instanceof nj.Cmplx) && (typeof(b.op_div) == "function"))
			return b.op_div(a, b);
		throw "nj.Cmplx type error";
	},
	op_solve: function(a, b) {
		var aIsScalar = typeof(a) == "number" || a instanceof nj.Cmplx;
		var bIsScalar = typeof(b) == "number" || b instanceof nj.Cmplx;
		if (aIsScalar && bIsScalar)
			return this.op_div(b, a);
		if (!(b instanceof nj.Cmplx) && (typeof(b.op_solve) == "function"))
			return b.op_solve(a, b);
		throw "nj.Cmplx type error";
	},
	op_pow: function(a, b) {
		var aIsScalar = typeof(a) == "number" || a instanceof nj.Cmplx;
		var bIsScalar = typeof(b) == "number" || b instanceof nj.Cmplx;
		if (aIsScalar && bIsScalar) {
			var aIsReal = nj.IM(a) == 0;
			var bIsReal = nj.IM(b) == 0;
			if (aIsReal && bIsReal)
				return Math.pow(nj.RE(a), nj.RE(b));
			if (aIsReal)
				return nj.EXP(nj.MUL(b, nj.LOG(a)));
			if (bIsReal)
				return nj.P(Math.pow(nj.ABS(a), nj.RE(b)), nj.ARG(a) * nj.RE(b));
		}
		if (!(b instanceof nj.Cmplx) && (typeof(b.op_pow) == "function"))
			return b.op_pow(a, b);
		throw "nj.Cmplx type error";
	},
	op_inv: function(a) {
		return nj.C(1 / (a.re*a.re + a.im*a.im), -a.im / (a.re*a.re + a.im*a.im));
	},
	op_neg: function(a) {
		return nj.C(-a.re, -a.im);
	},
	op_abs: function(a) {
		return Math.sqrt(a.re*a.re + a.im*a.im);
	},
	op_norm: function(a) {
		return Math.sqrt(a.re*a.re + a.im*a.im);
	},
	op_arg: function(a) {
		return Math.atan2(a.im, a.re);
	},
	op_conj: function(a) {
		return nj.C(a.re, -a.im);
	},
	op_transp: function(a) {
		return a;
	},
	op_exp: function(a) {
		var len = Math.exp(a.re);
		if (a.im == 0)
			return len;
		return nj.C(len * Math.cos(a.im), len * Math.sin(a.im));
	},
	op_log: function(a) {
		if (a.im == 0)
			return Math.log(a.re);
		throw "nj.Cmplx type error";
	},
	op_det: function(a) {
		return a;
	},
	op_re: function(a) {
		return a.re;
	},
	op_im: function(a) {
		return a.im;
	},
	op_round: function(a, n) {
		return nj.C(nj.ROUND(a.re, n), nj.ROUND(a.im, n));
	},
	op_eq: function(a, b) {
		if ((a instanceof nj.Cmplx) && (b instanceof nj.Cmplx))
			return a.re == b.re && a.im == b.im;
		if ((a instanceof nj.Cmplx) && (typeof(b) == "number"))
			return a.re == b && a.im == 0;
		if ((typeof(a) == "number") && (b instanceof nj.Cmplx))
			return a == b.re && 0 == b.im;
		if (!(b instanceof nj.Cmplx) && (typeof(b.op_eq) == "function"))
			return b.op_eq(a, b);
		throw "nj.Cmplx type error";
	},
	op_eq_abs: function(a, b, d) {
		var aIsScalar = typeof(a) == "number" || a instanceof nj.Cmplx;
		var bIsScalar = typeof(b) == "number" || b instanceof nj.Cmplx;
		if (aIsScalar && bIsScalar)
			return nj.ABS(nj.SUB(a, b)) <= d;
		if (!(b instanceof nj.Cmplx) && (typeof(b.op_eq_abs) == "function"))
			return b.op_eq_abs(a, b);
		throw "nj.Cmplx type error";
	},
	op_eq_rel: function(a, b, d) {
		var aIsScalar = typeof(a) == "number" || a instanceof nj.Cmplx;
		var bIsScalar = typeof(b) == "number" || b instanceof nj.Cmplx;
		if (aIsScalar && bIsScalar)
			return nj.ABS(nj.SUB(a, b)) <= d * (nj.ABS(a) + nj.ABS(b)) * 0.5;
		if (!(b instanceof nj.Cmplx) && (typeof(b.op_eq_rel) == "function"))
			return b.op_eq_rel(a, b);
		throw "nj.Cmplx type error";
	},
	toString: function(n) {
		return "(" + this.re.toString(n) + (this.im >= 0 ? "+" : "") +
				this.im.toString(n) + "i)";
	},
	toFixed: function(n) {
		return "(" + this.re.toFixed(n) + (this.im >= 0 ? "+" : "") +
				this.im.toFixed(n) + "i)";
	},
	toPrecision: function(n) {
		return "(" + this.re.toPrecision(n) + (this.im >= 0 ? "+" : "") +
				this.im.toPrecision(n) + "i)";
	}
};

nj.eps = (function(){
	var i = 0;
	while (1 + Math.pow(2, -i) != 1)
		i++;
	return Math.pow(2, -i/2);
})();

nj.ARG = function(a) {
	if (typeof(a.op_arg) == "function")
		return a.op_arg(a);
	if (typeof(a) == "number")
		return a >= 0 ? 0 : Math.PI;
	throw "nj.GenOps type error";
};

nj.NEG = function(a) {
	if (typeof(a.op_neg) == "function")
		return a.op_neg(a);
	if (typeof(a) == "number")
		return -a;
	throw "nj.GenOps type error";
};

nj.ABS = function(a) {
	if (typeof(a.op_abs) == "function")
		return a.op_abs(a);
	if (typeof(a) == "number")
		return Math.abs(a);
	throw "nj.GenOps type error";
};

nj.ADD = function(a, b) {
	if (typeof(a.op_add) == "function")
		return a.op_add(a, b);
	if (typeof(b.op_add) == "function")
		return b.op_add(a, b);
	if (typeof(a) == "number" && typeof(b) == "number")
		return a + b;
	throw "nj.GenOps type error";
};

nj.SUB = function(a, b) {
	if (typeof(a.op_sub) == "function")
		return a.op_sub(a, b);
	if (typeof(b.op_sub) == "function")
		return b.op_sub(a, b);
	if (typeof(a) == "number" && typeof(b) == "number")
		return a - b;
	throw "nj.GenOps type error";
};

nj.MUL = function(a, b) {
	if (typeof(a.op_mul) == "function")
		return a.op_mul(a, b);
	if (typeof(b.op_mul) == "function")
		return b.op_mul(a, b);
	if (typeof(a) == "number" && typeof(b) == "number")
		return a * b;
	throw "nj.GenOps type error";
};

nj.DOT = function(a, b) {
	if (typeof(a.op_mul) == "function")
		return a.op_dot(a, b);
	if (typeof(b.op_mul) == "function")
		return b.op_dot(a, b);
	if (typeof(a) == "number" && typeof(b) == "number")
		return a * b;
	throw "nj.GenOps type error";
};


nj.DIV = function(a, b) {
	if (typeof(a.op_div) == "function")
		return a.op_div(a, b);
	if (typeof(b.op_div) == "function")
		return b.op_div(a, b);
	if (typeof(a) == "number" && typeof(b) == "number")
		return a / b;
	throw "nj.GenOps type error";
};

nj.POW = function(a, b) {
	if (typeof(a.op_pow) == "function")
		return a.op_pow(a, b);
	if (typeof(b.op_pow) == "function")
		return b.op_pow(a, b);
	if (typeof(a) == "number" && typeof(b) == "number")
		return Math.pow(a, b);
	throw "nj.GenOps type error";
};

nj.EXP = function(a) {
	if (typeof(a.op_exp) == "function")
		return a.op_exp(a);
	if (typeof(a) == "number")
		return Math.exp(a);
	throw "nj.GenOps type error";
};

nj.RE = function(a) {
	if (typeof(a.op_re) == "function")
		return a.op_re(a);
	if (typeof(a) == "number")
		return a;
	throw "nj.GenOps type error";
};

nj.IM = function(a) {
	if (typeof(a.op_im) == "function")
		return a.op_im(a);
	if (typeof(a) == "number")
		return 0;
	throw "nj.GenOps type error";
};

nj.CONJ = function(a) {
	if (typeof(a.op_conj) == "function")
		return a.op_conj(a);
	if (typeof(a) == "number")
		return a;
	throw "nj.GenOps type error";
};