---
layout: post
title:  "Using logical operators &&, || with non-booleans"
date:   2013-02-10 20:18:48
description: "We often use neat trick with logical operators for non-boolean variables, here is how and why"
tag: "JavaScript"
color: "blue"
author: "Jurek Błaszczyk"
---

Sometimes we want to use predefined value but only if some other value is not defined (in other words we use defaults)
Usually we do it for function parameters e.g:

<script type="syntaxhighlighter" class="brush: javascript"><![CDATA[
    function test(a){
        var b = a || 3;
    }
]]></script>

So, b will become 3 only if a is not defined. If a is defined b will become a.
That is the same as:

<script type="syntaxhighlighter" class="brush: javascript"><![CDATA[
    function test(a){
        var b = a ? a : 3;
    }
]]></script>

Or most verbose:

<script type="syntaxhighlighter" class="brush: javascript"><![CDATA[
    function test(a){
        var b;
        
        if (!a) {
            b = 3;
        }
    }
]]></script>


In expression X||Y, X is first evaluated, and interpreted as a boolean value. 
If this boolean value is "true", then X is returned (X, not it’s boolean value). 
And Y is not evaluated. (Because it doesn't matter whether Y is true or Y is false, X||Y has been fully determined.) 
If boolean value of X is "false", then we still don't know if X||Y is true or false until we evaluate Y, and interpret it as a boolean value as well. 
So then Y gets returned.

&& does the same, except it stops evaluating if the first argument is false.
We use && to get nested object value avoiding 'undefined error'.

If below code if grand.parent is null or undefined we'll get error.

<script type="syntaxhighlighter" class="brush: javascript"><![CDATA[
    var  a = grand.parent.child;
]]></script>

So, we can fix it with:

<script type="syntaxhighlighter" class="brush: javascript"><![CDATA[
    var a;
    
    if (grand.parent) {
         a = grand.parent.child;
    }
]]></script>

or much less verbose:

<script type="syntaxhighlighter" class="brush: javascript"><![CDATA[
    var  a = grand.parent && grand.parent.child;
]]></script>





 
